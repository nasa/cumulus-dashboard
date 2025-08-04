/* eslint-disable import/no-cycle */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { generate } from 'shortid';
import { set } from 'object-path';
import slugify from 'slugify';
import PropTypes from 'prop-types';
import isFinite from 'lodash/isFinite';
import isEmpty from 'lodash/isEmpty';
import ErrorReport from '../Errors/report';
import TextForm from '../TextAreaForm/text';
import TextAreaForm from '../TextAreaForm/text-area';
import SimpleDropdown from '../DropDown/simple-dropdown';
import FormList from '../FormList/form-list';
import SubForm from '../SubForm/sub-form';
import t from '../../utils/strings';
import { window } from '../../utils/browser';

const scrollToFn =
  typeof window !== 'undefined' && typeof window.scrollTo === 'function'
    ? window.scrollTo
    : () => true;

export const formTypes = {
  text: 'TEXT',
  textArea: 'TEXT_AREA',
  dropdown: 'DROPDOWN',
  list: 'LIST',
  number: 'NUMBER',
  subform: 'SUB_FORM',
};

export const defaults = {
  json: '{\n  \n}',
};

const errorMessage = (errors) => `Please review the following fields and submit again: ${errors
    .map((error) => `'${error}'`)
    .join(', ')}`;

const generateDirty = (inputs) => Object.entries(inputs).reduce(
  (dirty, [id, { value }]) => ({
    ...dirty,
    [id]: isFinite(value) || !isEmpty(value),
  }),
  {}
);

const generateComponentId = (label, id) => `${slugify(label)}-${id}`;

const generateInputState = (inputMeta, id, oldInputState = {}) => {
  const inputState = {};

  inputMeta.forEach(({ schemaProperty, type, value, error, ...rest }) => {
    const inputId = generateComponentId(schemaProperty, id);
    let inputValue = value;

    if (oldInputState[inputId] && oldInputState[inputId].value) {
      inputValue = oldInputState[inputId].value;
    }

    if (!inputValue && inputValue !== 0) {
      switch (type) {
        case formTypes.list:
          inputValue = [];
          break;
        case formTypes.subform:
          inputValue = {};
          break;
        default:
          inputValue = '';
      }
    }

    inputState[inputId] = {
      ...rest,
      type,
      value: inputValue,
      schemaProperty,
      validationError: error, // this is the stored error message for the field
      error: null, // this is the displayed error for the field
    };
  });

  return inputState;
};

/**
 * Generates an HTML structure of form elements and
 * ties it to an onSubmit callback.
 * @param {Array} forms list of config objects, representing form items.
 * @param {String} form.type must match TEXT, TEXT_AREA, or other type listed above.
 * @param {String} form.label arbitrary label for the field.
 * @param {Function} form.validate function returning true or false based on the form input.
 * @param {String} form.error text to display when a form doesn't pass validation.
 * @return {JSX}
 */
export const Form = ({
  id,
  inputMeta,
  submit,
  cancel,
  status,
  nowrap,
}) => {
  const formId = useRef(generate());
  const domElementRef = useRef(null);
  const prevInputMetaRef = useRef(inputMeta);

  const [inputs, setInputs] = useState(generateInputState(inputMeta, formId.current));
  const [dirty, setDirty] = useState(generateDirty(inputs));
  const [errors, setErrors] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const isInflight = () => status && status === 'inflight';

  const validateField = ({ field, inputId, stateInputs, stateDirty, stateErrors }) => {
    let { value } = stateInputs[inputId] || {};
    let updatedErrors = stateErrors;

    if (!stateDirty[inputId] && !field.required) return { stateInputs, stateErrors: updatedErrors };

    if (stateInputs[inputId].error) {
      updatedErrors = updatedErrors.filter((item) => item !== field.labelText);
      delete stateInputs[inputId].error;
    }

    if (field.type === formTypes.textArea && field.mode === 'json') {
      try {
        value = JSON.parse(value);
      } catch {
        if (!updatedErrors.includes(field.labelText)) updatedErrors.push(field.labelText);
        stateInputs[inputId].error = t.errors.json;
      }
    } else if (field.type === formTypes.number) {
      try {
        value = parseInt(value, 10);
      } catch {
        if (!updatedErrors.includes(field.labelText)) updatedErrors.push(field.labelText);
        stateInputs[inputId].error = t.errors.integerRequired;
      }
    }

    if (field.validate && !field.validate(value)) {
      if (!updatedErrors.includes(field.labelText)) updatedErrors.push(field.labelText);
      const errorMsg = field.error || field.validationError || t.errors.generic;
      stateInputs[inputId].error = errorMsg;
    }

    return { stateInputs, stateErrors: updatedErrors };
  };

  const onChange = (inputId, value, handleChange) => {
    if (typeof handleChange === 'function') handleChange(value);

    setInputs((prevInputs) => {
      const newInputs = { ...prevInputs, [inputId]: { ...prevInputs[inputId], value } };
      const newDirty = { ...dirty, [inputId]: true };

      const validated = validateField({
        field: newInputs[inputId],
        inputId,
        stateInputs: { ...newInputs },
        stateDirty: newDirty,
        stateErrors: [...errors],
      });

      setDirty(newDirty);
      setErrors(validated.stateErrors);
      return validated.stateInputs;
    });
  };

  const scrollToTop = () => {
    if (domElementRef.current && typeof domElementRef.current.scrollIntoView === 'function') {
      domElementRef.current.scrollIntoView(true);
    } else {
      scrollToFn(0, 0);
    }
  };

  const submitPayload = useCallback(() => {
    if (errors.length === 0) {
      const payload = {};
      Object.entries(inputs).forEach(([_, entryValue]) => {
        const { value, required, schemaProperty, type, mode } = entryValue;

        if (
          required ||
          (Array.isArray(value) && value.length > 0) ||
          (!Array.isArray(value) && value !== '' && value !== '{}')
        ) {
          let payloadValue = value;
          if (type === formTypes.textArea && mode === 'json') {
            payloadValue = JSON.parse(value);
          } else if (type === formTypes.number) {
            payloadValue = parseInt(value, 10);
          }
          set(payload, schemaProperty, payloadValue);
        }
      });
      submit && submit(id, payload);
    } else {
      scrollToTop();
    }
    setSubmitted(false);
  }, [errors, inputs, submit, id]);

  const onSubmit = (e) => {
    if (e) e.preventDefault();
    if (isInflight()) return;

    let newInputs = { ...inputs };
    let newErrors = [...errors];
    inputMeta.forEach((field) => {
      const inputId = generateComponentId(field.schemaProperty, formId.current);
      const validated = validateField({
        field,
        inputId,
        stateInputs: newInputs,
        stateDirty: dirty,
        stateErrors: newErrors,
      });
      newInputs = validated.stateInputs;
      newErrors = validated.stateErrors;
    });

    setInputs(newInputs);
    setErrors(newErrors);
    setSubmitted(true);
  };

  const onCancel = (e) => {
    e.preventDefault();
    if (!isInflight()) cancel && cancel(id);
  };

  useEffect(() => {
    if (prevInputMetaRef.current !== inputMeta) {
      setInputs(generateInputState(inputMeta, formId.current, inputs));
      setDirty(generateDirty(inputs));
      prevInputMetaRef.current = inputMeta;
    }
  }, [inputMeta, inputs]);

  useEffect(() => {
    if (submitted) submitPayload();
  }, [submitted, submitPayload]);

  let submitButtonText = 'Submit';
  if (isInflight()) {
    submitButtonText = 'Loading...';
  } else if (status === 'success') {
    submitButtonText = 'Success';
  }

  const hasRequiredFields = inputMeta.filter((input) => input.required).length >= 0;

  const formContent = (
      <div
        className="container" ref={domElementRef}>
        {errors.length > 0 && (
          <ErrorReport report={errorMessage(errors)} disableScroll={true} />
        )}
        <ul>
          {inputMeta.map((input) => {
            const { type, label, handleChange } = input;
            let element;

            switch (type) {
              case formTypes.textArea:
                element = TextAreaForm;
                break;
              case formTypes.dropdown:
                element = SimpleDropdown;
                break;
              case formTypes.list:
                element = FormList;
                break;
              case formTypes.subform:
                element = SubForm;
                break;
              case formTypes.text:
              default:
                element = TextForm;
                break;
            }

            const inputId = generateComponentId(input.schemaProperty, formId.current);
            let { value, error } = inputs[inputId] || {};

            // coerce non-null values to string to simplify PropType warnings on numbers
            if (
              type !== formTypes.list &&
              type !== formTypes.subform &&
              !value &&
              value !== 0
            ) {
              value = String(value);
            }

            // filter out empty values from the list
            if (type === formTypes.list) {
              value = value?.filter((item) => item !== '');
            }

            // dropdowns have options
            const options =
              (type === formTypes.dropdown && input.options) || null;
            // textarea forms pass a mode value to ace
            const mode = (type === formTypes.textArea && input.mode) || null;
            // subforms have fieldsets that define child form structure
            const fieldset =
              (type === formTypes.subform && input.fieldSet) || null;
            const autoComplete =
              type === formTypes.text && input.isPassword ? 'on' : null;
            // text forms can be type=password or number
            let textType =
              type === formTypes.text && input.isPassword ? 'password' : null;
            const additionalConfig = {};

            if (type === formTypes.number) {
              textType = 'number';
              additionalConfig.min = 0;
            }

            const elem = React.createElement(element, {
              id: inputId,
              label,
              value,
              error,
              mode,
              options,
              fieldset,
              type: textType,
              autoComplete,
              onChange: (idParam, val) => onChange(idParam, val, handleChange),
              ...additionalConfig,
            });

            return (
              <li className="form__item" key={inputId}>
                {elem}
              </li>
            );
          })}
        </ul>

        {hasRequiredFields && (
          <div className="form__item form__item--require__description">
            <p>
              <span className="label__required">* </span>
              <span className="label__name">Required field</span>
            </p>
          </div>
        )}

        {submit && (
          <button
            className={`button button__animation--md button__arrow button__arrow--md button__animation button__arrow--white form-group__element--right button--submit${
              isInflight() ? ' button--disabled' : ''
            }`}
            onClick={onSubmit}
          >
            {submitButtonText}
          </button>
        )}

        {cancel && (
          <button
            className={`button button__animation--md button__arrow button__arrow--md button__animation button--secondary form-group__element--right button--cancel${
              isInflight() ? ' button--disabled' : ''
            }`}
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
  );

  return nowrap
    ? (
        formContent
      )
    : (
      <form
        className="page__section--fullpage-form page__section--fullpage-form--internal"
        id={`form-${formId.current}`}
      >
        {formContent}
      </form>
      );
};

Form.propTypes = {
  id: PropTypes.string,
  inputMeta: PropTypes.array,
  submit: PropTypes.func,
  cancel: PropTypes.func,
  status: PropTypes.string,
  nowrap: PropTypes.bool,
};
