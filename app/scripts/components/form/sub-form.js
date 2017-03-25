'use strict';
import React from 'react';
import { Form } from './';
import { set } from 'object-path';
import { createFormConfig } from './schema';

const SubForm = React.createClass({
  propTypes: {
    label: React.PropTypes.string,
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

    // create a default
    if (!fields.length) {
      fields.push({
        name: 'New',
        fields: createFormConfig({}, fieldSet)
      });
    }

    return (
      <div id={id} className='subform'>
        <label>{label}</label>
        <span className='form__error'>{error}</span>
        {fields.map(this.renderFieldset)}
      </div>
    );
  },

  renderFieldset: function (fieldset) {
    const { name } = fieldset;
    const isExpanded = this.state.expanded[name];
    const expanded = isExpanded ? ' subform__item--expanded' : '';
    return (
      <div key={name} className={'subform__item' + expanded }>
        <div className='subform__ui'>
          <span className='subform__name'>{name}</span>
          <button
            className='button subform__button'
            onClick={this.toggleExpand}
            data-value={name}
            >{isExpanded ? 'Cancel' : 'Edit'}</button>
        </div>
        { isExpanded ? this.renderExpandedField(fieldset) : null }
      </div>
    );
  },

  renderExpandedField: function (fieldset) {
    const { name, fields } = fieldset;
    return (
      <div className='subform__fields'>
        <Form id={name} nowrap={true} inputMeta={fields} submit={this.update}/>
      </div>
    );
  },

  toggleExpand: function (e) {
    e.preventDefault();
    const name = e.currentTarget.getAttribute('data-value');
    const { expanded } = this.state;
    expanded[name] = !expanded[name];
    this.setState({ expanded });
  },

  update: function (id, payload) {
    const { expanded } = this.state;
    expanded[id] = false;
    setTimeout(() => this.setState({ expanded }), 200);
    const { value } = this.props;
    set(value, id, payload);
    this.props.onChange(this.props.id, value);
  }
});

export default SubForm;
