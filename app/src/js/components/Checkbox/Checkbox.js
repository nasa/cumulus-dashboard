import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import Tooltip from '../Tooltip/tooltip';

const Checkbox = ({
  id,
  checked,
  onChange,
  label,
  inputLabel,
  className,
  tip = '',
}) => (
  <div className={`list__filters--item form-group__element filter-${className}`}>
    <div className="label" style={{ display: 'inline-block', marginRight: '10px' }}>{label}</div>
    {tip && (
      <Tooltip
        className="tooltip--light"
        id={`${id}-tooltip`}
        placement={'right'}
        target={
          <FontAwesomeIcon
            className="button__icon--animation"
            icon={faInfoCircle}
          />
        }
        tip={tip}
      />
    )}
    <label htmlFor={id} className="checkmark--wrapper">
      {inputLabel || label }
      <input id={id}
        type="checkbox" checked={checked}
        onChange={(e) => { onChange(e.target.checked); }} />
      <span className="checkmark"></span>
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
  tip: PropTypes.string
};

export default Checkbox;
