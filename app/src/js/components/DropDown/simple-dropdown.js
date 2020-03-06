'use strict';
import React from 'react';
import PropTypes from 'prop-types';
// import './DropDown.scss';

class Dropdown extends React.Component {
  constructor (props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange (e) {
    this.props.onChange(this.props.id, e.target.value);
  }

  render () {
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
        <ul>
          <li className="dropdown__label">
            <label htmlFor={id}>{label}</label>
          </li>
          <li className="dropdown__element">
            <div className='dropdown__wrapper'>
              <select id={id} value={value} onChange={this.onChange}>
                {renderedOptions.map((option, i) => {
                  const [value, label] = Array.isArray(option) ? option : [option, option];
                  return (<option key={i} value={value}>{label}</option>);
                })}
              </select>
            </div>
          </li>
        </ul>
        <span className='form__error'>{error}</span>
      </div>
    );
  }
}

Dropdown.propTypes = {
  label: PropTypes.any,
  value: PropTypes.string,
  options: PropTypes.array,
  id: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func,
  noNull: PropTypes.bool
};

export default Dropdown;
