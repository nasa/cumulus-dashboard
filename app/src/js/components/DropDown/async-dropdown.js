import React from 'react';
import PropTypes from 'prop-types';
import Async from 'react-select/async';

const AsyncDropdown = ({
  onInputChange,
  onChange,
  className = '',
  id,
  label,
  error,
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

  const promiseOptions = (inputValue) => new Promise((resolve) => {
    resolve(onInputChange(inputValue));
  });

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
          <Async
            aria-label={label}
            blurInputOnSelect={true}
            {...rest}
            className={`dropdown ${className}`}
            classNamePrefix="react-select"
            defaultOptions={true}
            onChange={handleChange}
            value={valueObject}
            options={optionsObject}
            loadOptions={promiseOptions}
          />
        </li>
      </ul>
      {error && <span className="form__error">{error}</span>}
    </div>
  );
};

AsyncDropdown.propTypes = {
  className: PropTypes.string,
  onInputChange: PropTypes.func,
  error: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.any,
  onChange: PropTypes.func,
  options: PropTypes.array,
  value: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.array,
  ]),
};

export default AsyncDropdown;
