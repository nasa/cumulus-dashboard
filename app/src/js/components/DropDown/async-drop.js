import React from 'react';
import PropTypes from 'prop-types';
import AsyncSelect from 'react-select/async';

const AsyncDropdown = ({
  onInputChange,
  options,
}) => {
  const promiseOptions = (inputValue) => new Promise((resolve) => {
    resolve(onInputChange(inputValue));
    console.log(inputValue);
  });
  return (
    <AsyncSelect
      defaultOptions={options}
      loadOptions={promiseOptions}
    />
  );
};

AsyncDropdown.propTypes = {
  onInputChange: PropTypes.func,
  options: PropTypes.array,
};

export default AsyncDropdown;