'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Dropdown = React.createClass({
  displayName: 'Dropdown',

  propTypes: {
    dispatch: PropTypes.func,
    options: PropTypes.object,
    getOptions: PropTypes.func,
    action: PropTypes.func,
    clear: PropTypes.func,
    paramKey: PropTypes.string,
    label: PropTypes.any
  },

  componentWillMount: function () {
    const { dispatch, getOptions } = this.props;
    if (getOptions) { dispatch(getOptions()); }
  },

  componentWillUnmount: function () {
    const { dispatch, clear } = this.props;
    dispatch(clear(this.props.paramKey));
  },

  onChange: function (e) {
    const { dispatch, action, clear } = this.props;
    const selected = e.currentTarget.value;
    if (selected.length) {
      dispatch(action({ key: this.props.paramKey, value: selected }));
    } else {
      dispatch(clear(this.props.paramKey));
    }
  },

  render: function () {
    // `options` are expected in the following format:
    // {displayValue1: optionElementValue1, displayValue2, optionElementValue2, ...}
    const { options, label, paramKey } = this.props;

    // Make sure this form ID is unique!
    // If needed in future, could add MD5 hash of stringified options,
    // or a UUID library such as `hat()`
    const formID = `form-${label}-${paramKey}`;

    return (
      <div className='filter__item'>
        {label ? <label htmlFor={formID}>{label}</label> : null}
        <form id={formID} className='dropdown__wrapper form-group__element'>
          <select onChange={this.onChange}>
            {Object.keys(options || {}).map((key, i) => (
              <option key={`${options[key]}-${i}`} value={options[key]}>{key}</option>
            ))}
          </select>
        </form>
      </div>
    );
  }
});
export default connect()(Dropdown);
