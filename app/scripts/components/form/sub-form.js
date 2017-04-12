'use strict';
import React from 'react';
import { Form, formTypes } from './';
import { set } from 'object-path';
import { createFormConfig } from './schema';
import { isText } from '../../utils/validate';

const SubForm = React.createClass({
  propTypes: {
    label: React.PropTypes.any,
    value: React.PropTypes.object,
    fieldSet: React.PropTypes.object,
    id: React.PropTypes.string,
    error: React.PropTypes.string,
    onChange: React.PropTypes.func
  },

  getInitialState: function () {
    return {
      expanded: {}
    };
  },

  render: function () {
    const {
      label,
      error,
      id,
      value,
      fieldSet
    } = this.props;
    const fields = [];
    for (let key in value) {
      fields.push({
        name: key,
        fields: createFormConfig(value[key], fieldSet)
      });
    }

    fields.push({
      fields: createFormConfig({}, fieldSet),
      isEmpty: true
    });

    // add a 'name' field for each item
    fields.forEach(field => field.fields.unshift({
      value: field.isEmpty ? '' : field.name,
      label: 'Name *',
      schemaProperty: '_id',
      type: formTypes.text,
      validate: isText
    }));

    return (
      <div id={id} className='subform'>
        <label>{label}</label>
        <span className='form__error'>{error}</span>
        {fields.map(this.renderFieldset)}
      </div>
    );
  },

  renderFieldset: function (fieldset, index, fields) {
    const { name } = fieldset;
    const isExpanded = this.state.expanded[name];
    const expanded = isExpanded ? ' subform__item--expanded' : '';
    const isLast = index === fields.length - 1;
    const last = isLast ? ' subform__item--last' : '';
    return (
      <div key={name} className={'subform__item' + expanded + last}>
        <div className='subform__ui'>
          <span className='subform__name'>{name}</span>
          <a href='#'
            className='subform__button'
            onClick={this.toggleExpand}
            data-value={name}
            >{isExpanded ? 'Cancel' : fieldset.isEmpty ? 'Add Another' : 'Edit'}</a>
          {isExpanded && !fieldset.isEmpty ? (
            <a href='#'
              className='subform__button link--secondary subform__remove'
              onClick={this.remove}
              data-value={name}
              >✗ Remove</a>
          ) : null}
        </div>
        { isExpanded ? this.renderExpandedField(fieldset) : null }
      </div>
    );
  },

  renderExpandedField: function (fieldset) {
    const { name, fields } = fieldset;
    return (
      <div className='subform__fields'>
        <Form id={name} nowrap={true} inputMeta={fields} submit={this.update} cancel={this.hide}/>
      </div>
    );
  },

  toggleExpand: function (e) {
    e.preventDefault();
    const id = e.currentTarget.getAttribute('data-value');
    const { expanded } = this.state;
    expanded[id] = !expanded[id];
    this.setState({ expanded });
  },

  hide: function (id) {
    const { expanded } = this.state;
    expanded[id] = false;
    this.setState({ expanded });
  },

  remove: function (e) {
    e.preventDefault();
    const id = e.currentTarget.getAttribute('data-value');
    this.update(id, null);
  },

  update: function (id, payload) {
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
});

export default SubForm;
