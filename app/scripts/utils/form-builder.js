'use strict';
import React from 'react';
import { generate } from 'shortid';
import slugify from 'slugify';
import textForm from '../components/forms/text';
import textAreaForm from '../components/forms/text-area';

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
export const build = function (forms, onSubmit) {
  forms = forms || [];
  const id = generate();

  // Attach an id to each form
  forms.forEach(d => {
    d.id = slugify(d.label) + '-' + id;
  });

  return function () {
    return (
      <form>
        <ul id={id} className='form__multistep'>
          {forms.map((form) => {
            let {
              type,
              label,
              id,
              validate,
              error
            } = form;
            type = type || formTypes.text;

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
            const elem = React.createElement(element, { label, id, validate, error, mode });
            return <div className='form__item' key={id}>{elem}</div>;
          })}
          <input className='button form-group__element--left button__animation--md button__arrow button__arrow--md button__animation button__arrow--white' type='submit' value='Submit' />
          <button className='button button--secondary form-group__element--left button__animation--md button__arrow button__arrow--md button__animation button__cancel' type='button'>Cancel</button>

        </ul>
      </form>
    );
  };
};
