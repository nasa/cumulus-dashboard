import React from 'react';
import PropTypes from 'prop-types';
import Async from 'react-select/async';
import { customStyles, DropdownIndicator } from '../../utils/dropdown-utils';

const AsyncDropdown = ({
  onInputChange,
  onChange,
  id,
  error,
  options = [],
  value,
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
    <div style={{ width: '300px' }}>
      <Async
        blurInputOnSelect={true}
        components={ { DropdownIndicator } }
        style={customStyles}
        defaultOptions={options}
        onChange= {handleChange}
        value={valueObject}
        options={optionsObject}
        loadOptions={promiseOptions}
      />
    </div>
  );
};

AsyncDropdown.propTypes = {
  onInputChange: PropTypes.func,
  error: PropTypes.string,
  id: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.array,
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.array]),
};

export default AsyncDropdown;
