'use strict';
import React from 'react';
import { connect } from 'react-redux';

import 'brace';
import 'brace/mode/json';
import 'brace/theme/github';

import Ace from 'react-ace';

const tabSize = 2;
const minLines = 12;
const maxLines = 24;

const TextAreaForm = React.createClass({
  displayName: 'TextAreaForm',

  propTypes: {
    label: React.PropTypes.string,
    value: React.PropTypes.string,
    id: React.PropTypes.string,
    error: React.PropTypes.string,
    mode: React.PropTypes.string,
    onChange: React.PropTypes.func
  },

  onChange: function (value) {
    this.props.onChange(this.props.id, value);
  },

  render: function () {
    let {
      label,
      value,
      id,
      error,
      mode
    } = this.props;
    return (
      <div className='form__textarea'>
        <label>{label} {error}</label>
        <Ace
          mode={mode}
          theme='github'
          onChange={this.onChange}
          name={id}
          value={value}

          width='auto'
          tabSize={tabSize}
          showPrintMargin={false}
          minLines={minLines}
          maxLines={maxLines}
          wrapEnabled={true}
        />
      </div>
    );
  }
});

export default connect(state => state)(TextAreaForm);
