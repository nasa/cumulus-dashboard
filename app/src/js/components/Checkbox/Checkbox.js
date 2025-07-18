import React from 'react';
import PropTypes from 'prop-types';

const Checkbox = ({
  id,
  checked,
  onChange,
  label,
  inputLabel,
  className
}) => (
  <div className={`list__filters--item form-group__element filter-${className}`}>
    <div className="label">{label}</div>
    <label htmlFor={id}>
      <div className="checkmark--wrapper input--label">
        <input id={id}
          type="checkbox" checked={checked}
          onChange={(e) => { onChange(e.target.checked); }}
          style={{ marginRight: '0.5em' }} />
        <span className="checkmark"></span>
        {inputLabel || label }
      </div>
    </label>
  </div>
);

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func,
  inputLabel: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string,
};

export default Checkbox;
