import React, { useState } from 'react';
import PropTypes from 'prop-types';

const FormList = ({ error, id, label, onChange, value }) => {
  const [values, setValues] = useState(value?.length ? value : ['']);

  function handleChange(index, newValue) {
    // make a copy of values so we can update the index
    const newValues = [...values];
    newValues[index] = newValue;
    setValues(newValues);
    onChange(id, newValues);
  }

  function addItem(e) {
    e.preventDefault();
    if (!value[value.length - 1]) return;
    setValues((prevValues) => [...prevValues, '']);
  }

  function removeItem(index) {
    // make a copy of values so we can update the index
    const newValues = [...values];
    newValues.splice(index, 1);
    setValues(newValues);
    onChange(id, newValues);
  }

  function renderItem(item, index, items) {
    const add = index === items.length - 1;
    // only allow adds if you've entered something
    const disabled = add && !item.length;
    return (
      <li key={index} className="form__addone--item">
        <input
          className="form__addone--input"
          value={item}
          onChange={(e) => handleChange(index, e.target.value)}
        />
        {add && (
          <button
            aria-label="Add"
            onClick={addItem}
            className={`button form__addone--button${
              disabled ? ' button--disabled' : ''
            }`}
          >
            +
          </button>
        )}

        {!add && (
          <button
            aria-label="Remove"
            onClick={(e) => {
              e.preventDefault();
              removeItem(index);
            }}
            className="button form__addone--button"
          >
            -
          </button>
        )}
      </li>
    );
  }

  return (
    <div className={`form__addone${error ? ' form__error--wrapper' : ''}`}>
      <label>
        {label}
        {error && <span className="form__error">{error}</span>}
        <ul className="form__addone--items">{values.map(renderItem)}</ul>
      </label>
    </div>
  );
};

FormList.propTypes = {
  error: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.any,
  onChange: PropTypes.func,
  value: PropTypes.array,
};

export default FormList;
