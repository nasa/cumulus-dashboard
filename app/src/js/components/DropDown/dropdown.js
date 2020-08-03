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
  const customOption = results.find((result) => result.customOption);
  return (
    <Menu {...menuProps} className="autocomplete__menu">
      {customOption &&
        <MenuItem
          className="autocomplete__select"
          key={0}
          option={customOption}
          position={0}
        >
          {customOption.label}
        </MenuItem>
      }
      {results.map((result, index) => {
        if (result.customOption) return;
        const position = customOption ? index + 1 : index;
        return (
          <MenuItem
            className="autocomplete__select"
            key={position}
            option={result}
            position={position}
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
  clearButton = true,
  dispatch,
  getOptions,
  inputProps,
  label,
  onChange,
  options,
  paramKey,
  queryParams,
  selectedValues = [],
  setQueryParams,
}) => {
  const typeaheadRef = createRef();
  const [selected, setSelected] = useState(selectedValues);
  const allowNew = paramKey === 'limit' || paramKey === 'page';

  function getOptionFromParam(options, paramValue) {
    return options.filter((item) => item.id === paramValue);
  }

  function updateSelection(selections, value) {
    dispatch(action({ key: paramKey, value }));
    setSelected(selections);
    setQueryParams({ [paramKey]: value });
  }

  function handleChange(selections) {
    const item = selections[0];
    const { customOption, id, label } = item || {};
    const value = customOption ? label : id;
    const updateSelectionCallback = () => updateSelection(selections, value);
    if (typeof onChange === 'function') {
      onChange(selections, updateSelectionCallback);
    } else {
      updateSelectionCallback();
    }
    updateSelection(selections, value);
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
      const updateSelectionCallback = () => updateSelection(selectedValue, value);
      if (typeof onChange === 'function') {
        onChange(selectedValue, updateSelectionCallback);
      } else {
        updateSelectionCallback();
      }
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
      if (typeof clear === 'function') dispatch(clear(paramKey));
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, allowNew, clear, dispatch, JSON.stringify(options), paramKey, JSON.stringify(queryParams)]);

  useEffect(() => {
    if (getOptions) dispatch(getOptions());
  }, [dispatch, getOptions]);

  useEffect(() => {
    if (selectedValues.length !== 0) {
      const { id: value } = selectedValues[0];
      updateSelection(selectedValues, value);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(selectedValues)]);

  return (
    <div className={`filter__item form-group__element filter-${paramKey}`}>
      {label && <label>{label}</label>}
      <Typeahead
        allowNew={allowNew}
        clearButton={clearButton}
        id={paramKey}
        inputProps={inputProps}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        options={options}
        ref={typeaheadRef}
        renderInput={renderInput}
        renderMenu={renderMenu}
        selected={selected}
      />
    </div>
  );
};

Dropdown.propTypes = {
  action: PropTypes.func,
  clear: PropTypes.func,
  clearButton: PropTypes.bool,
  dispatch: PropTypes.func,
  getOptions: PropTypes.func,
  inputProps: PropTypes.object,
  label: PropTypes.any,
  onChange: PropTypes.func,
  options: PropTypes.array,
  paramKey: PropTypes.string,
  queryParams: PropTypes.object,
  selectedValues: PropTypes.array,
  setQueryParams: PropTypes.func,
};

export default withRouter(withQueryParams()(connect()(Dropdown)));
