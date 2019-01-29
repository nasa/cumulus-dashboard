'use strict';
import React from 'react';
import { generate } from 'shortid';
import { set } from 'object-path';
import slugify from 'slugify';
import ErrorReport from '../errors/report';
import TextForm from './text';
import TextAreaForm from './text-area';
import Dropdown from './simple-dropdown';
import List from './arbitrary-list';
import SubForm from './sub-form';
import t from '../../utils/strings';
import PropTypes from 'prop-types';
import { window } from '../../utils/browser';
const scrollTo = typeof window.scrollTo === 'function' ? window.scrollTo : () => true;

export const formTypes = {
  text: 'TEXT',
  textArea: 'TEXT_AREA',
  dropdown: 'DROPDOWN',
  list: 'LIST',
  number: 'NUMBER',
  subform: 'SUB_FORM'
};

export const defaults = {
  json: '{\n  \n}'
};

const errorMessage = (errors) => `Please review ${errors.join(', ')} and submit again.`;

/**
 * Generates an HTML structure of form elements and
 * ties it to an onSubmit callback.
 * @param {Array} forms list of config objects, representing form items.
 * @param {String} form.type must match TEXT, TEXT_AREA, or other type listed above.
 * @param {String} form.label arbitrary label for the field.
 * @param {Function} form.validate function returning true or fase based on the form input.
 * @param {String} form.error text to display when a form doesn't pass validation.
 * @return {JSX}
 */
export class Form extends React.Component {
  constructor () {
    super();
    this.state = {
      inputs: {},
      dirty: {},
      errors: []
    };
    this.displayName = 'Form';
    this.generateComponentId = this.generateComponentId.bind(this);
    this.isInflight = this.isInflight.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.scrollToTop = this.scrollToTop.bind(this);
  }

  generateComponentId (label) {
    return slugify(label) + '-' + this.id;
  }

  componentDidMount () {
    // generate id for this form
    this.id = generate();

    // initiate empty state for all inputs
    const inputState = {};
    this.props.inputMeta.forEach(input => {
      let inputId = this.generateComponentId(input.schemaProperty);
      let value = input.value;
      if (!value && value !== 0) {
        value = input.type === formTypes.list ? []
          : input.type === formTypes.subform ? {} : '';
      }
      let error = null;
      inputState[inputId] = { value, error };
    });
    this.setState({ inputs: inputState }); // eslint-disable-line react/no-did-mount-set-state
  }

  isInflight () {
    return this.props.status && this.props.status === 'inflight';
  }

  onChange (inputId, value) {
    // update the internal key/value store, in addition to marking as dirty
    const inputState = Object.assign({}, this.state.inputs);
    set(inputState, [inputId, 'value'], value);

    const markedDirty = Object.assign({}, this.state.dirty);
    markedDirty[inputId] = true;

    this.setState(Object.assign({}, this.state, {
      inputs: inputState,
      dirty: markedDirty
    }));
  }

  onCancel (e) {
    e.preventDefault();
    if (this.isInflight()) { return; }
    this.props.cancel(this.props.id);
  }

  onSubmit (e) {
    e.preventDefault();
    if (this.isInflight()) { return; }
    const inputState = Object.assign({}, this.state.inputs);

    // validate input values in the store
    // if values pass validation, write to payload object
    const errors = [];
    const payload = {};
    this.props.inputMeta.forEach(input => {
      let inputId = this.generateComponentId(input.schemaProperty);
      let { value } = inputState[inputId];

      // don't set a value for values that haven't changed
      const markedDirty = this.state.dirty[inputId];
      if (!markedDirty) {
        return;
      }

      // if expected type is json, validate as json first
      if (input.type === formTypes.textArea && input.mode === 'json') {
        try {
          value = JSON.parse(value);
        } catch (e) {
          errors.push(input.schemaProperty);
          return set(inputState, [inputId, 'error'], t.errors.json);
        }
      }

      if (input.type === formTypes.number) {
        try {
          value = parseInt(value);
        } catch (e) {
          errors.push(input.schemaProperty);
          return set(inputState, [inputId, 'error'], t.errors.integerRequired);
        }
      }

      if (input.validate && !input.validate(value)) {
        errors.push(input.schemaProperty);
        let error = input.error || t.errors.generic;
        return set(inputState, [inputId, 'error'], error);
      } else if (inputState[inputId].error) {
        delete inputState[inputId].error;
      }

      // Ignore empty fields that aren't required
      // These may have input elements in the form, but
      // the API will fail if it's sent empty strings
      if (value !== '' || input.required) {
        set(payload, input.schemaProperty, value);
      }
    });

    this.setState(Object.assign({}, this.state, {
      inputs: inputState
    }));

    if (errors.length) this.scrollToTop();
    else this.props.submit(this.props.id, payload);
    this.setState({errors});
  }

  scrollToTop () {
    if (this.DOMElement && typeof this.DOMElement.scrollIntoView === 'function') {
      this.DOMElement.scrollIntoView(true);
    } else scrollTo(0, 0);
  }

  render () {
    const inputState = this.state.inputs;
    const { errors } = this.state;
    const { status } = this.props;
    const form = (
      <div ref={(element) => { this.DOMElement = element; }}>
        {errors.length ? <ErrorReport report={errorMessage(errors)} /> : null}
        <ul>
          {this.props.inputMeta.map(form => {
            let { type, label } = form;

            // decide which element to render
            let element;
            switch (type) {
              case formTypes.textArea:
                element = TextAreaForm;
                break;
              case formTypes.dropdown:
                element = Dropdown;
                break;
              case formTypes.list:
                element = List;
                break;
              case formTypes.subform:
                element = SubForm;
                break;
              case formTypes.text:
              default:
                element = TextForm;
                break;
            }

            // retrieve value and errors stored in state
            let inputId = this.generateComponentId(form.schemaProperty);
            let { value, error } = inputState[inputId];
            // coerce non-null values to string to simplify proptype warnings on numbers
            if (type !== formTypes.list && type !== formTypes.subform && !value && value !== 0) {
              value = String(value);
            }
            // dropdowns have options
            let options = type === formTypes.dropdown && form.options || null;
            // textarea forms pass a mode value to ace
            const mode = type === formTypes.textArea && form.mode || null;
            // subforms have fieldsets that define child form structure
            const fieldSet = type === formTypes.subform && form.fieldSet || null;

            // text forms can be type=password or number
            let textType = (type === formTypes.text && form.isPassword) ? 'password' : null;
            if (type === formTypes.number) {
              textType = 'number';
            }

            const elem = React.createElement(element, {
              id: inputId,
              label,
              value,
              error,
              mode,
              options,
              fieldSet,
              type: textType,
              onChange: this.onChange
            });
            return <li className='form__item' key={inputId}>{elem}</li>;
          })}
        </ul>

        {this.props.submit ? (
          <button
            className={'button button__animation--md button__arrow button__arrow--md button__animation button__arrow--white' + (this.isInflight() ? ' button--disabled' : '')}
            onClick={this.onSubmit}
            >{this.isInflight() ? 'Loading...' : status === 'success' ? 'Success!' : 'Submit'}</button>
        ) : null}

        {this.props.cancel ? (
            <button
              className={'button button__animation--md button__arrow button__arrow--md button__animation button--secondary form-group__element--left button__cancel' + (this.isInflight() ? ' button--disabled' : '')}
              onClick={this.onCancel}
            >Cancel</button>
        ) : null}
      </div>
    );
    return this.props.nowrap ? form : <form className='page__section--fullpage-form page__section--fullpage-form--internal' id={`form-${this.id}`}>{form}</form>;
  }
}

Form.propTypes = {
  id: PropTypes.string,
  inputMeta: PropTypes.array,
  submit: PropTypes.func,
  cancel: PropTypes.func,
  status: PropTypes.string,
  nowrap: PropTypes.bool
};
