/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-cycle */
import React from 'react';
import PropTypes from 'prop-types';
import { set } from 'object-path';
import { Form, formTypes } from '../Form/Form';
import { createFormConfig } from '../FormSchema/schema';
import { isText } from '../../utils/validate';

class SubForm extends React.Component {
  constructor () {
    super();
    this.state = { expanded: {} };
    this.renderFieldset = this.renderFieldset.bind(this);
    this.renderExpandedField = this.renderExpandedField.bind(this);
    this.toggleExpand = this.toggleExpand.bind(this);
    this.hide = this.hide.bind(this);
    this.remove = this.remove.bind(this);
    this.update = this.update.bind(this);
  }

  render () {
    const {
      label,
      error,
      id,
      value,
      fieldSet
    } = this.props;

    const fields = Object.keys(value).map((key) => ({
      name: key,
      fields: createFormConfig({ data: value[key], schema: fieldSet })
    }));

    fields.push({
      name: 'Add',
      fields: createFormConfig({ data: {}, schema: fieldSet }),
      isEmpty: true
    });

    // add a 'name' field for each item
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
        {fields.map(this.renderFieldset)}
      </div>
    );
  }

  renderFieldset (fieldset, index, fields) {
    const { name } = fieldset;
    const isExpanded = this.state.expanded[name];
    const expanded = isExpanded ? ' subform__item--expanded' : '';
    const isLast = index === fields.length - 1;
    const last = isLast ? ' subform__item--last' : '';
    let linkText;

    if (isExpanded) {
      linkText = 'Cancel';
    } else if (fieldset.isEmpty) {
      linkText = 'Add Another';
    } else {
      linkText = 'Edit';
    }

    return (
      <div key={name} className={`subform__item${expanded}${last}`}>
        <div className='subform__ui'>
          <span className='subform__name'>{name}</span>
          <button
            className='subform__button'
            onClick={this.toggleExpand}
            data-value={name}
          >{linkText}</button>
          {isExpanded && !fieldset.isEmpty
            ? (
            <button
              className='subform__button link--secondary subform__remove'
              onClick={this.remove}
              data-value={name}
            >✗ Remove</button>
              )
            : null}
        </div>
        { isExpanded ? this.renderExpandedField(fieldset) : null }
      </div>
    );
  }

  renderExpandedField (fieldset) {
    const { name, fields } = fieldset;
    return (
      <div className='subform__fields'>
        <Form id={name} nowrap={true} inputMeta={fields} submit={this.update} cancel={this.hide}/>
      </div>
    );
  }

  toggleExpand (e) {
    e.preventDefault();
    const id = e.currentTarget.getAttribute('data-value');
    const { expanded } = this.state;
    expanded[id] = !expanded[id];
    this.setState({ expanded });
  }

  hide (id) {
    const { expanded } = this.state;
    expanded[id] = false;
    this.setState({ expanded });
  }

  remove (e) {
    e.preventDefault();
    const id = e.currentTarget.getAttribute('data-value');
    this.update(id, null);
  }

  update (id, payload) {
    setTimeout(() => this.hide(id), 200);
    const { value } = this.props;
    if (!payload) {
      delete value[id];
    } else {
      // use the `_id` property to set the payload,
      // to account for someone changing the name of the file.
      set(value, payload._id, payload);
      // if the old name doesn't match the new name,
      // delete the old name to avoid duplication.
      if (id !== payload._id) delete value[id];
    }
    this.props.onChange(this.props.id, value);
  }
}

SubForm.propTypes = {
  label: PropTypes.any,
  value: PropTypes.object,
  fieldSet: PropTypes.object,
  id: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func
};

export default SubForm;
