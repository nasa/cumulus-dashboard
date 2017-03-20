'use strict';
import React from 'react';
import { Form } from './';

const SubForm = React.createClass({
  propTypes: {
    label: React.PropTypes.string,
    value: React.PropTypes.object,
    fields: React.PropTypes.array,
    id: React.PropTypes.string,
    error: React.PropTypes.string,
    onChange: React.PropTypes.func
  },

  getInitialState: function () {
    return {
    }
  },

  componentWillReceiveProps: function (newProps) {
  },

  renderFieldset: function (fieldset) {
    return (
      <div key={fieldset.name} className='subform__item'>
        <div className='form__text'>
          <input className='subform__name' value={fieldset.name} type='text' />
        </div>
      </div>
    );
  },

  render: function () {
    const {
      label,
      error,
      id
    } = this.props;
    return (
      <div id={id} className='subform'>
        <label>{label} {error}</label>
        {this.props.fields.map(this.renderFieldset)}
      </div>
    );
  }
});

export default SubForm;
