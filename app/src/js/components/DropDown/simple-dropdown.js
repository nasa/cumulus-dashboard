import React from 'react';
import PropTypes from 'prop-types';
import Select, { components } from 'react-select';

const DropdownIndicator = (props) => (
  <components.DropdownIndicator {...props}>
    <div className="dropdown__indicator" />
  </components.DropdownIndicator>
);

const customStyles = {
  control: (base, state) => ({
    ...base,
    // backgroundColor: '#2276ac',
  }),
  menu: (base) => ({
    ...base,
    margin: 0,
    zIndex: 9999,
  }),
};

const SimpleDropdown = ({
  className,
  error,
  id,
  label,
  noNull,
  onChange,
  options = [],
  value,
}) => {
  // const renderedOptions =
  //   options[0] === '' || noNull ? options : [''].concat(options);

  console.log(options);

  const optionsObject = options.map((option) => {
    if (typeof option === 'object') return option;
    return {
      label: option,
      value: option,
    };
  });

  const valueObject =
    typeof value === 'object' ? value : { label: value, value };

  function handleChange(option) {
    if (typeof onChange === 'function') onChange(id, option.value, option);
  }

  return (
    <div className={`form__dropdown${error ? ' form__error--wrapper' : ''}`}>
      <ul>
        <li className="dropdown__label">
          <label htmlFor={id}>{label}</label>
        </li>
        <li className="dropdown__element">
          <Select
            className={className}
            components={{ DropdownIndicator }}
            options={optionsObject}
            // styles={customStyles}
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
  label: PropTypes.any,
  value: PropTypes.string,
  options: PropTypes.array,
  id: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func,
  noNull: PropTypes.bool,
};

export default SimpleDropdown;
