'use strict';
import React from 'react';
import { generate } from 'shortid';
import { set } from 'object-path';
import slugify from 'slugify';
import textForm from './text';
import textAreaForm from './text-area';

export const formTypes = {
  text: 'TEXT',
  textArea: 'TEXT_AREA'
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
      inputs: []
    };
  },

  propTypes: {
    inputs: React.PropTypes.array
  },

  componentWillMount: function () {
    // generate id for this form
    this.id = generate();

    // initiate empty state for all inputs
    const inputs = {};
    this.props.inputs.forEach(input => {
      let inputId = this.generateComponentId(input.label);
      inputs[inputId] = '';
    });
    this.setState({ inputs });
  },

  generateComponentId: function (label) {
    return slugify(label) + '-' + this.id;
  },

  onSubmit: function (e) {
    e.preventDefault();
  },

  onChange: function (value, id) {
    const nextState = set(this.state, {
      inputs: {
        [id]: value
      }
    });
    this.setState(nextState);
  },

  render: function () {
    return (
      <form id={`form-${this.id}`}>
        <ul className='form__multistep'>
          {this.props.inputs.map(form => {
            let {
              type,
              label,
              validate,
              error
            } = form;
            type = type || formTypes.text;
            let id = this.generateComponentId(label);

            let element;
            switch (type) {
              case formTypes.textArea:
                element = textAreaForm;
                break;
              case formTypes.text:
              default:
                element = textForm;
                break;
            }

            // textarea forms pass a mode value to ace
            let mode = type === formTypes.textArea && form.mode || null;
            const onChange = this.onChange;
            const elem = React.createElement(element, {
              label,
              id,
              validate,
              error,
              mode,
              onChange
            });
            return <div className='form__item' key={id}>{elem}</div>;
          })}
        </ul>

        <input
          type='submit'
          value='Submit'
          onClick={this.onSubmit}
          className='button form-group__element--left button__animation--md button__arrow button__arrow--md button__animation button__arrow--white'
        />
        <button className='button button--secondary form-group__element--left button__animation--md button__arrow button__arrow--md button__animation button__cancel' type='button'>Cancel</button>

      </form>
    );
  }
});
