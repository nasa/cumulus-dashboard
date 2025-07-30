import React from 'react';
import PropTypes from 'prop-types';

const TextForm = ({
  label,
  value,
  id,
  error,
  onChange,
  type,
  className
}) => {
  const handleChange = (e) => {
    onChange(id, e.target.value);
  };

  return (
    <div className={`form__text${error ? ' form__error--wrapper' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {error && <span className='form__error'>{error}</span>}
      <input
        id={id}
        type={type || 'text'}
        value={value}
        className={className}
        onChange={handleChange}
      />
    </div>
  );
};
TextForm.propTypes = {
  label: PropTypes.any,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  id: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.string,
  className: PropTypes.string
};

export default TextForm;
