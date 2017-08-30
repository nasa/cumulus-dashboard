'use strict';
import React from 'react';

var TextForm = React.createClass({
  propTypes: {
    label: React.PropTypes.any,
    value: React.PropTypes.string,
    id: React.PropTypes.string,
    error: React.PropTypes.string,
    onChange: React.PropTypes.func,
    type: React.PropTypes.string,
    className: React.PropTypes.string
  },

  onChange: function (e) {
    this.props.onChange(this.props.id, e.target.value);
  },

  render: function () {
    let {
      label,
      value,
      id,
      error,
      type,
      className
    } = this.props;

    type = type || 'text';

    return (
      <div className='form__text'>
        <label htmlFor={id}>{label}</label>
        <span className='form__error'>{error}</span>
        <input
          id={id}
          type={type}
          value={value}
          className={className}
          onChange={this.onChange}
        />
      </div>
    );
  }
});

export default TextForm;
