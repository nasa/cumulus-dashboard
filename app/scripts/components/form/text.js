'use strict';
import React from 'react';
import { connect } from 'react-redux';

var TextForm = React.createClass({
  displayName: 'TextForm',

  propTypes: {
    label: React.PropTypes.string
  },

  render: function () {
    return (
      <div className='form__text'>
        <label>{this.props.label}</label>
        <input type='text' />
      </div>
    );
  }
});

export default connect(state => state)(TextForm);
