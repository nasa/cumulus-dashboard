import React from 'react';
import PropTypes from 'prop-types';
import Select, { components } from 'react-select';
import {customStyles, DropdownIndicator} from '../../../js/utils/dropdown-utils'

const SimpleDropdown = ({
  className,
  error,
  id,
  label,
  onChange,
  options = [],
  value,
  ...rest
}) => {
  const optionsObject = options.map((option) => {
    if (typeof option === 'object') return option;
    return {
      label: option,
      value: option,
    };
  });

  let valueObject = value;

  if (!value) valueObject = null;
  else if (typeof value !== 'object') valueObject = { label: value, value };

  function handleChange(option) {
    if (typeof onChange === 'function') {
      if (!option || Array.isArray(option)) onChange(id, option);
      else onChange(id, option.value, option);
    }
  }

  return (
    <div className={`form__dropdown${error ? ' form__error--wrapper' : ''}`}>
      <ul>
        <li className="dropdown__label">
          <label htmlFor={id}>{label}</label>
        </li>
        <li className="dropdown__element">
          <Select
            aria-label={label}
            {...rest}
            blurInputOnSelect={true}
            className={className}
            components={{ DropdownIndicator }}
            options={optionsObject}
            onChange={handleChange}
            styles={customStyles}
            value={valueObject}
          />
        </li>
      </ul>
      {error && <span className="form__error">{error}</span>}
    </div>
  );
};

SimpleDropdown.propTypes = {
  className: PropTypes.string,
  error: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.any,
  onChange: PropTypes.func,
  options: PropTypes.array,
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.array]),
};

export default SimpleDropdown;