'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';

var Dropdown = createReactClass({
  propTypes: {
    label: PropTypes.any,
    value: PropTypes.string,
    options: PropTypes.array,
    id: PropTypes.string,
    error: PropTypes.string,
    onChange: PropTypes.func,
    noNull: PropTypes.bool
  },

  onChange: function (e) {
    this.props.onChange(this.props.id, e.target.value);
  },

  render: function () {
    const {
      label,
      value,
      options,
      id,
      error,
      noNull
    } = this.props;

    const renderedOptions = options[0] === '' || noNull ? options : [''].concat(options);

    return (
      <div className='form__dropdown'>
        <label htmlFor={id}>{label}</label>
        <span className='form__error'>{error}</span>
        <div className='dropdown__wrapper'>
          <select id={id} value={value} onChange={this.onChange}>
            {renderedOptions.map((d, i) => <option value={d} key={i}>{d}</option>)}
          </select>
        </div>
      </div>
    );
  }
});
export default Dropdown;
