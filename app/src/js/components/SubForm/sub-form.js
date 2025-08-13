/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-cycle */
import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { set } from 'object-path';
import { Form, formTypes } from '../Form/Form';
import { createFormConfig } from '../FormSchema/schema';
import { isText } from '../../utils/validate';

const SubForm = ({
  label,
  value,
  fieldSet,
  id,
  error,
  onChange
}) => {
  const [expanded, setExpanded] = useState({});

  const hide = useCallback((targetId) => {
    setExpanded((prev) => ({
      ...prev,
      [targetId]: false
    }));
  }, []);

  const update = useCallback((targetId, payload) => {
    setTimeout(() => hide(targetId), 200);
    const updatedValue = { ...value };
    if (!payload) {
      delete updatedValue[targetId];
    } else {
      set(updatedValue, payload._id, payload);
      if (targetId !== payload._id) {
        delete updatedValue[targetId];
      }
    }
    onChange(id, updatedValue);
  }, [hide, id, onChange, value]);

  const renderExpandedField = useCallback((fieldset) => {
    const { name, fields } = fieldset;
    return (
      <div className='subform__fields'>
        <Form id={name} nowrap={true} inputMeta={fields} submit={update} cancel={hide}/>
      </div>
    );
  }, [hide, update]);

  const toggleExpand = useCallback((e) => {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('data-value');
    setExpanded((prev) => ({
      ...prev,
      [targetId]: !prev[targetId]
    }));
  }, []);

  const remove = useCallback((e) => {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('data-value');
    update(targetId, null);
  }, [update]);

  const renderFieldset = useCallback((fieldset, index, fields) => {
    const { name } = fieldset;
    const isExpanded = expanded[name];
    const expandedClass = isExpanded ? ' subform__item--expanded' : '';
    const isLast = index === fields.length - 1;
    const lastClass = isLast ? ' subform__item--last' : '';
    let linkText;

    if (isExpanded) {
      linkText = 'Cancel';
    } else if (fieldset.isEmpty) {
      linkText = 'Add Another';
    } else {
      linkText = 'Edit';
    }

    return (
      <div key={name} className={`subform__item${expandedClass}${lastClass}`}>
        <div className='subform__ui'>
          <span className='subform__name'>{name}</span>
          <button
            className='subform__button'
            onClick={toggleExpand}
            data-value={name}
          >{linkText}</button>
          {isExpanded && !fieldset.isEmpty && (
            <button
              className='subform__button link--secondary subform__remove'
              onClick={remove}
              data-value={name}
            >✗ Remove</button>
          )}
      </div>
        {isExpanded && renderExpandedField(fieldset)}
      </div>
    );
  }, [expanded, remove, renderExpandedField, toggleExpand]);

  const fields = Object.keys(value).map((key) => ({
    name: key,
    fields: createFormConfig({ data: value[key], schema: fieldSet })
  }));

  fields.push({
    name: 'Add',
    fields: createFormConfig({ data: {}, schema: fieldSet }),
    isEmpty: true
  });

  fields.forEach((field) => field.fields.unshift({
    value: field.isEmpty ? '' : field.name,
    label: 'Name *',
    schemaProperty: '_id',
    type: formTypes.text,
    validate: isText
  }));

  return (
  <div id={id} className={`subform${error ? ' form__error--wrapper' : ''}`}>
    <label>{label}</label>
    {error && <span className='form__error'>{error}</span>}
    {fields.map(renderFieldset)}
  </div>
  );
};

SubForm.propTypes = {
  label: PropTypes.any,
  value: PropTypes.object,
  fieldSet: PropTypes.object,
  id: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func
};

export default SubForm;
