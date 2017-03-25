'use strict';
import React from 'react';
import { connect } from 'react-redux';

import 'brace';
import 'brace/mode/json';
import 'brace/theme/github';

import Ace from 'react-ace';
import config from '../../config';

const _minLines = 8;
const _maxLines = 18;

const TextAreaForm = React.createClass({
  displayName: 'TextAreaForm',

  propTypes: {
    label: React.PropTypes.any,
    value: React.PropTypes.string,
    id: React.PropTypes.string,
    error: React.PropTypes.string,
    mode: React.PropTypes.string,
    onChange: React.PropTypes.func,

    minLines: React.PropTypes.number,
    maxLines: React.PropTypes.number
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

    let minLines = this.props.minLines || _minLines;
    let maxLines = this.props.maxLines || _maxLines;

    return (
      <div className='form__textarea'>
        <label>{label} {error}</label>
        <Ace
          mode={mode}
          theme={config.editorTheme}
          onChange={this.onChange}
          name={id}
          value={value}

          width='auto'
          tabSize={config.tabSize}
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
