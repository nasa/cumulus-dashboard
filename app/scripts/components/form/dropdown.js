'use strict';
import React from 'react';
import map from 'lodash.map';
import { dropdownOption } from '../../utils/format';

const Dropdown = React.createClass({
  displayName: 'Dropdown',

  propTypes: {
    dispatch: React.PropTypes.func,
    options: React.PropTypes.object,
    getOptions: React.PropTypes.func,
    action: React.PropTypes.func,
    clear: React.PropTypes.func,
    paramKey: React.PropTypes.string,
    label: React.PropTypes.any
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
            {map(options || {'': ''}, dropdownOption)}
          </select>
        </form>
      </div>
    );
  }
});
export default Dropdown;
