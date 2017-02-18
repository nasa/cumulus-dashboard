'use strict';
import React from 'react';
import { connect } from 'react-redux';

var TextAreaForm = React.createClass({
  displayName: 'TextAreaForm',

  propTypes: {
    label: React.PropTypes.string
  },

  render: function () {
    return (
      <div className='form__textarea'>
        <label>{this.props.label}</label>
        <textarea rows="4" cols="50"></textarea>
      </div>
    );
  }
});

export default connect(state => state)(TextAreaForm);
