'use strict';
import React from 'react';

var Dropdown = React.createClass({
  propTypes: {
    label: React.PropTypes.any,
    value: React.PropTypes.string,
    options: React.PropTypes.array,
    id: React.PropTypes.string,
    error: React.PropTypes.string,
    onChange: React.PropTypes.func
  },

  onChange: function (e) {
    this.props.onChange(this.props.id, e.target.value);
  },

  render: function () {
    let {
      label,
      value,
      options,
      id,
      error
    } = this.props;

    return (
      <div className='form__dropdown'>
        <label htmlFor={id}>{label}</label>
        <span className='form__error'>{error}</span>
        <div className='dropdown__wrapper'>
          <select id={id} value={value} onChange={this.onChange}>
            {options.map((d, i) => <option value={d} key={i}>{d}</option>)}
          </select>
        </div>
      </div>
    );
  }
});
export default Dropdown;
