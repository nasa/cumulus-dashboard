'use strict';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import withQueryParams from 'react-router-query-params';
import {
  Typeahead,
  Menu,
  MenuItem,
  Hint,
  Input,
} from 'react-bootstrap-typeahead';

function renderInput(inputProps) {
  return (
    <Hint
      shouldSelect={(shouldSelect, e) => {
        // Selects the hint when the user hits the 'enter' key.
        return e.keyCode === 13 || shouldSelect;
      }}
    >
      <Input {...inputProps} />
    </Hint>
  );
}

function renderMenu(items, menuProps) {
  return (
    <Menu {...menuProps} className="autocomplete__menu">
      {items.map((item, index) => {
        return (
          <MenuItem
            className="autocomplete__select"
            key={index}
            option={item}
            position={index}
          >
            {item.label}
          </MenuItem>
        );
      })}
    </Menu>
  );
}

const Dropdown = ({
  action,
  dispatch,
  getOptions,
  inputProps,
  label,
  options,
  paramKey,
  queryParams,
  setQueryParams,
}) => {
  const [selected, setSelected] = useState([]);
  const allowNew = paramKey === 'limit';

  function getOptionFromParam(options, paramValue) {
    return options.filter((item) => item.id === paramValue);
  }

  function onChange(selectedValues) {
    const item = selectedValues[0];
    const { customOption, id, label } = item || {};
    const value = customOption ? label : id;
    dispatch(action({ key: paramKey, value }));
    setSelected(selectedValues);
    setQueryParams({ [paramKey]: value });
  }

  useEffect(() => {
    const paramValue = queryParams[paramKey];
    dispatch(action({ key: paramKey, value: paramValue }));
    if (paramValue) {
      let selectedValue = getOptionFromParam(options, paramValue);
      if (allowNew && selectedValue.length === 0) {
        selectedValue = [
          {
            id: paramValue,
            label: paramValue,
          },
        ];
      }
      setSelected(selectedValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(queryParams)]);

  useEffect(() => {
    if (getOptions) dispatch(getOptions());
  }, [dispatch, getOptions]);

  return (
    <div className={`filter__item form-group__element filter-${paramKey}`}>
      {label && <label>{label}</label>}
      <Typeahead
        allowNew={allowNew}
        clearButton={true}
        id={paramKey}
        inputProps={inputProps}
        onChange={onChange}
        options={options}
        renderInput={renderInput}
        renderMenu={renderMenu}
        selected={selected || []}
      />
    </div>
  );
};

Dropdown.propTypes = {
  action: PropTypes.func,
  dispatch: PropTypes.func,
  getOptions: PropTypes.func,
  inputProps: PropTypes.object,
  label: PropTypes.any,
  options: PropTypes.array,
  paramKey: PropTypes.string,
  queryParams: PropTypes.object,
  setQueryParams: PropTypes.func,
};

export default withRouter(withQueryParams()(connect()(Dropdown)));
