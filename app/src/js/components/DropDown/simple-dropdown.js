import React from 'react';
import PropTypes from 'prop-types';
import Select, { components } from 'react-select';

const DropdownIndicator = (props) => (
  <components.DropdownIndicator {...props}>
    <div className="dropdown__indicator" />
  </components.DropdownIndicator>
);

const borderRadius = '0.5em';
const boxShadow = '0 1px 3px rgba(0,0,0,.08)';

const customStyles = {
  control: (base) => ({
    ...base,
    border: '1px solid #eceaea',
    borderRadius,
  }),
  menu: (base) => ({
    ...base,
    margin: 0,
    zIndex: 9999,
  }),
  indicatorsContainer: (base) => ({
    ...base,
    backgroundColor: '#2276ac',
    borderRadius: `0 ${borderRadius} ${borderRadius} 0`,
    boxShadow,
  }),
  indicatorSeparator: (base) => ({
    display: 'none',
  }),
};

const SimpleDropdown = ({
  className,
  error,
  id,
  label,
  onChange,
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
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

export default SimpleDropdown;
