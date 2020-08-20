import React from 'react';
import PropTypes from 'prop-types';
import Select, { components } from 'react-select';
import { borderGrey, oceanBlue, white } from '../../../css/utils/variables/_colors.scss';
import { shadowDefault } from '../../../css/utils/variables/_shadows.scss';

const DropdownIndicator = (props) => (
  <components.DropdownIndicator {...props}>
    <div className="dropdown__indicator" />
  </components.DropdownIndicator>
);

const border = `1px solid ${borderGrey}`;
const borderRadius = '0.5em';
const boxShadow = shadowDefault;

const customStyles = {
  control: (base) => ({
    ...base,
    border,
    borderRadius,
    boxShadow,
  }),
  menu: (base) => ({
    ...base,
    margin: 0,
    zIndex: 9999,
  }),
  indicatorsContainer: (base) => ({
    ...base,
    backgroundColor: oceanBlue,
    borderRadius: `0 ${borderRadius} ${borderRadius} 0`,
    boxShadow,
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  option: (base, state) => {
    const styles = state.isFocused || state.isSelected ? {
      backgroundColor: oceanBlue,
      color: white,
    } : {};
    return {
      ...base,
      ...styles,
    };
  },
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
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

export default SimpleDropdown;
