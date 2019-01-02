'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';

var TextForm = createReactClass({
  propTypes: {
    label: PropTypes.any,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    id: PropTypes.string,
    error: PropTypes.string,
    onChange: PropTypes.func,
    type: PropTypes.string,
    className: PropTypes.string
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
