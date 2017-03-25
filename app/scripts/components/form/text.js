'use strict';
import React from 'react';

var TextForm = React.createClass({
  propTypes: {
    label: React.PropTypes.any,
    value: React.PropTypes.string,
    id: React.PropTypes.string,
    error: React.PropTypes.string,
    onChange: React.PropTypes.func,
    type: React.PropTypes.string
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
      type
    } = this.props;

    type = type || 'text';

    return (
      <div className='form__text'>
        <label>{label} {error}</label>
        <input
          id={id}
          type={type}
          value={value}
          onChange={this.onChange}
        />
      </div>
    );
  }
});

export default TextForm;
