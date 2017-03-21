'use strict';
import React from 'react';
import { generate } from 'shortid';
import { set } from 'object-path';
import slugify from 'slugify';
import TextForm from './text';
import TextAreaForm from './text-area';
import Dropdown from './simple-dropdown';
import List from './arbitrary-list';
import SubForm from './sub-form';
import t from '../../utils/strings';

export const formTypes = {
  text: 'TEXT',
  textArea: 'TEXT_AREA',
  dropdown: 'DROPDOWN',
  list: 'LIST',
  subform: 'SUB_FORM'
};

export const defaults = {
  json: '{\n  \n}'
};

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
export const Form = React.createClass({
  displayName: 'Form',

  getInitialState: function () {
    return {
      inputs: {}
    };
  },

  propTypes: {
    id: React.PropTypes.string,
    inputMeta: React.PropTypes.array,
    submit: React.PropTypes.func,
    cancel: React.PropTypes.func,
    inflight: React.PropTypes.bool,
    nowrap: React.PropTypes.bool
  },

  generateComponentId: function (label) {
    return slugify(label) + '-' + this.id;
  },

  componentWillMount: function () {
    // generate id for this form
    this.id = generate();

    // initiate empty state for all inputs
    const inputState = {};
    this.props.inputMeta.forEach(input => {
      let inputId = this.generateComponentId(input.label);
      let value = input.value
      if (!value && value !== 0) {
        value = input.type === formTypes.list ? []
          : input.type === formTypes.subform ? {} : '';
      }
      let error = null;
      inputState[inputId] = { value, error };
    });
    this.setState({ inputs: inputState });
  },

  onChange: function (inputId, value) {
    const inputState = Object.assign({}, this.state.inputs);
    set(inputState, [inputId, 'value'], value);
    this.setState(Object.assign({}, this.state, {
      inputs: inputState,
      error: null
    }));
  },

  onCancel: function (e) {
    e.preventDefault();
    this.props.cancel();
  },

  onSubmit: function (e) {
    e.preventDefault();
    if (this.props.inflight) { return; }
    const inputState = Object.assign({}, this.state.inputs);

    // validate input values in the store
    // if values pass validation, write to payload object
    let hasError = false;
    const payload = {};
    this.props.inputMeta.forEach(input => {
      let inputId = this.generateComponentId(input.label);
      let { value } = inputState[inputId];

      // if expected type is json, validate as json first
      if (input.type === formTypes.textArea && input.mode === 'json') {
        try {
          value = JSON.parse(value);
        } catch (e) {
          hasError = true;
          return set(inputState, [inputId, 'error'], t.errors.json);
        }
      }

      if (input.validate && !input.validate(value)) {
        hasError = true;
        let error = input.error || t.errors.generic;
        return set(inputState, [inputId, 'error'], error);
      }

      set(payload, input.schemaProperty, value);
    });

    this.setState(Object.assign({}, this.state, {
      inputs: inputState
    }));

    if (!hasError) {
      this.props.submit(this.props.id, payload);
    }
  },

  render: function () {
    const inputState = this.state.inputs;
    const form = (
      <div>
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
            let inputId = this.generateComponentId(label);
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
            const elem = React.createElement(element, {
              id: inputId,
              label,
              value,
              error,
              mode,
              options,
              fieldSet,
              onChange: this.onChange
            });
            return <li className='form__item' key={inputId}>{elem}</li>;
          })}
        </ul>

        {this.props.submit ? (
          <span className='button form-group__element--left button__animation--md button__arrow button__arrow--md button__animation button__arrow--white'>
            <input
              type='submit'
              value={this.props.inflight ? 'Loading...' : 'Submit'}
              onClick={this.onSubmit}
              readOnly={true}
            />
          </span>
        ) : null}

        {this.props.cancel ? (
          <span className='button button--secondary form-group__element--left button__animation--md button__arrow button__arrow--md button__animation button__cancel'>
            <input
              type='cancel'
              value='Cancel'
              onClick={this.onCancel}
              readOnly={true}
            />
          </span>
        ) : null}
      </div>
    );
    return this.props.nowrap ? form : <form id={`form-${this.id}`}>{form}</form>;
  }
});
