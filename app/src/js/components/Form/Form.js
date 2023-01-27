/* eslint-disable import/no-cycle */
import React from 'react';
import { createNextState } from '@reduxjs/toolkit';
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

const scrollTo =
  window && typeof window.scrollTo === 'function'
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
export class Form extends React.Component {
  constructor(props) {
    super(props);

    // Generate ID for this form
    this.id = generate();
    this.onChange = this.onChange.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    const inputs = generateInputState(props.inputMeta, this.id);
    const dirty = generateDirty(inputs);

    this.state = {
      inputs,
      dirty,
      errors: [],
      submitted: false,
    };
  }

  isInflight() {
    return this.props.status && this.props.status === 'inflight';
  }

  onChange(inputId, value, handleChange) {
    if (typeof handleChange === 'function') handleChange(value);
    // Update the internal key/value store, in addition to marking as dirty
    this.setState(
      createNextState((state) => {
        state.inputs[inputId].value = value;
        state.dirty[inputId] = true;
        // validate the field for live changes
        this.validateField({
          field: this.state.inputs[inputId],
          inputId,
          state,
        });
      })
    );
  }

  validateField({ field, inputId, state }) {
    const { dirty, inputs } = state;
    let { value } = inputs[inputId] || {};

    // don't set a value for values that haven't changed and aren't required
    if (!dirty[inputId] && !field.required) return;

    if (inputs[inputId].error) {
      state.errors = state.errors.filter((item) => item !== field.labelText);
      delete inputs[inputId].error;
    }

    const { errors } = state;

    // if expected type is json, validate as json first
    if (field.type === formTypes.textArea && field.mode === 'json') {
      try {
        value = JSON.parse(value);
      } catch (e) {
        if (!errors.includes(field.labelText)) errors.push(field.labelText);
        inputs[inputId].error = t.errors.json;
      }
    } else if (field.type === formTypes.number) {
      try {
        value = parseInt(value, 10);
      } catch (e) {
        if (!errors.includes(field.labelText)) errors.push(field.labelText);
        inputs[inputId].error = t.errors.integerRequired;
      }
    }

    if (field.validate && !field.validate(value)) {
      if (!errors.includes(field.labelText)) errors.push(field.labelText);
      const error = field.error || field.validationError || t.errors.generic;
      inputs[inputId].error = error;
    }
  }

  onCancel(e) {
    e.preventDefault();

    if (!this.isInflight()) {
      this.props.cancel(this.props.id);
    }
  }

  onSubmit(e) {
    if (e) e.preventDefault();
    if (this.isInflight()) return;

    // validate input values in the store

    this.setState(
      createNextState((state) => {
        this.props.inputMeta.forEach((field) => {
          const inputId = generateComponentId(field.schemaProperty, this.id);

          this.validateField({
            field,
            inputId,
            state,
          });
        });

        state.submitted = true;
      })
    );
  }

  submitPayload() {
    const { inputs, errors } = this.state;
    const payload = {};

    if (errors.length === 0) {
      Object.entries(inputs).forEach((entry) => {
        const entryValue = entry[1];
        const { value, required, schemaProperty, type, mode } = entryValue;

        if (
          required ||
          // only add an optional array when it is not empty
          (Array.isArray(value) && value.length > 0) ||
          // only add an optional value when it is not an empty string or will create an empty object
          (!Array.isArray(value) && value !== '' && value !== '{}')
        ) {
          let payloadValue = value;
          // these should be safe since we've already validated at this point
          if (type === formTypes.textArea && mode === 'json') {
            payloadValue = JSON.parse(value);
          } else if (type === formTypes.number) {
            payloadValue = parseInt(value, 10);
          }
          set(payload, schemaProperty, payloadValue);
        }
      });
      this.props.submit(this.props.id, payload);
    } else {
      this.scrollToTop();
    }

    this.setState({ submitted: false });
  }

  scrollToTop() {
    if (
      this.DOMElement &&
      typeof this.DOMElement.scrollIntoView === 'function'
    ) {
      this.DOMElement.scrollIntoView(true);
    } else {
      scrollTo(0, 0);
    }
  }

  componentDidUpdate(prevProps) {
    const { inputMeta } = this.props;

    if (prevProps.inputMeta !== inputMeta) {
      const inputs = generateInputState(inputMeta, this.id, this.state.inputs);
      const dirty = generateDirty(inputs);
      this.setState({ inputs, dirty });
    }
    if (this.state.submitted) {
      this.submitPayload();
    }
  }

  render() {
    const inputState = this.state.inputs;
    const { errors } = this.state;
    const { status } = this.props;
    let submitButtonText;

    if (this.isInflight()) {
      submitButtonText = 'Loading...';
    } else if (status === 'success') {
      submitButtonText = 'Success!';
    } else {
      submitButtonText = 'Submit';
    }

    const hasRequiredFields =
      this.props.inputMeta.filter((input) => input.required).length >= 0;

    const form = (
      <div
        className="container"
        ref={(element) => {
          this.DOMElement = element;
        }}
      >
        {errors.length > 0 && (
          <ErrorReport report={errorMessage(errors)} disableScroll={true} />
        )}
        <ul>
          {this.props.inputMeta.map((input) => {
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

            const inputId = generateComponentId(input.schemaProperty, this.id);
            let { value, error } = inputState[inputId] || {};

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
              onChange: (id, val) => this.onChange(id, val, handleChange),
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

        {this.props.submit && (
          <button
            className={`button button__animation--md button__arrow button__arrow--md button__animation button__arrow--white form-group__element--right button--submit${
              this.isInflight() ? ' button--disabled' : ''
            }`}
            onClick={this.onSubmit}
          >
            {submitButtonText}
          </button>
        )}

        {this.props.cancel && (
          <button
            className={`button button__animation--md button__arrow button__arrow--md button__animation button--secondary form-group__element--right button--cancel${
              this.isInflight() ? ' button--disabled' : ''
            }`}
            onClick={this.onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    );

    return this.props.nowrap
      ? (
          form
        )
      : (
      <form
        className="page__section--fullpage-form page__section--fullpage-form--internal"
        id={`form-${this.id}`}
      >
        {form}
      </form>
        );
  }
}

Form.propTypes = {
  id: PropTypes.string,
  inputMeta: PropTypes.array,
  submit: PropTypes.func,
  cancel: PropTypes.func,
  status: PropTypes.string,
  nowrap: PropTypes.bool,
};
