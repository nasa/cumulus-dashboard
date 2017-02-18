'use strict';
import React from 'react';
import { generate } from 'shortid';
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
  return (
    <div id={id} className='forms'>
      {forms.map(form => {
        let {
          type,
          label,
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
        const elem = React.createElement(element, { type, label, validate, error });
        return <div className='form__item'>{elem}</div>;
      })}
    </div>
  );
};
