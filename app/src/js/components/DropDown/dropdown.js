'use strict';
import React, { useState, useEffect, createRef } from 'react';
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

function renderInput({ inputRef, referenceElementRef, ...inputProps }) {
  return (
    <Hint
      shouldSelect={(shouldSelect, e) => {
        // Selects the hint when the user hits the 'enter' key.
        return e.keyCode === 13 || shouldSelect;
      }}
    >
      <Input
        {...inputProps}
        ref={(input) => {
          inputRef(input);
          referenceElementRef(input);
        }}
      />
    </Hint>
  );
}

renderInput.propTypes = {
  inputRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  referenceElementRef: PropTypes.func,
};

function renderMenu(results, menuProps) {
  return (
    <Menu {...menuProps} className="autocomplete__menu">
      {results.map((result, index) => {
        return (
          <MenuItem
            className="autocomplete__select"
            key={index}
            option={result}
            position={index}
          >
            {result.label}
          </MenuItem>
        );
      })}
    </Menu>
  );
}

const Dropdown = ({
  action,
  clear,
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
  const typeaheadRef = createRef();

  function getOptionFromParam(options, paramValue) {
    return options.filter((item) => item.id === paramValue);
  }

  function updateSelection(selectedValues, value) {
    dispatch(action({ key: paramKey, value }));
    setSelected(selectedValues);
    setQueryParams({ [paramKey]: value });
  }

  function handleChange(selectedValues) {
    const item = selectedValues[0];
    const { customOption, id, label } = item || {};
    const value = customOption ? label : id;
    updateSelection(selectedValues, value);
  }

  function handleKeyDown(e) {
    if (!allowNew) return;
    if (e.keyCode === 13) {
      const value = e.target.value;
      const selectedValue = [
        {
          id: value,
          label: value,
        },
      ];
      updateSelection(selectedValue, value);
      typeaheadRef.current.hideMenu();
    }
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

    return function cleanup() {
      dispatch(clear(paramKey));
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, allowNew, clear, dispatch, JSON.stringify(options), paramKey, JSON.stringify(queryParams)]);

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
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        options={options}
        ref={typeaheadRef}
        renderInput={renderInput}
        renderMenu={renderMenu}
        selected={selected || []}
      />
    </div>
  );
};

Dropdown.propTypes = {
  action: PropTypes.func,
  clear: PropTypes.func,
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
