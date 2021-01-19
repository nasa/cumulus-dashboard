import React, { useState, useEffect, createRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import withQueryParams from 'react-router-query-params';
import { Typeahead } from 'react-bootstrap-typeahead';
import { renderTypeaheadInput, renderTypeaheadMenu } from '../../utils/typeahead-helpers';

const Dropdown = ({
  action,
  clear,
  clearButton = true,
  dispatch,
  getOptions,
  inputProps,
  label,
  onChange,
  options = [],
  paramKey,
  queryParams,
  selectedValues = [],
  setQueryParams,
  clearOnClick,
}) => {
  const typeaheadRef = createRef();
  const [initialQueryParams] = useState(queryParams);
  const [selected, setSelected] = useState(selectedValues);
  const allowNew = paramKey === 'limit' || paramKey === 'page';

  function getOptionFromParam(paramOptions, paramValue) {
    return paramOptions.filter((item) => item.id === paramValue);
  }

  function updateSelection(selections, value) {
    dispatch(action({ key: paramKey, value }));
    setSelected(selections);
    setQueryParams({ [paramKey]: value });
  }

  function handleChange(selections) {
    const item = selections[0];
    const { customOption, id, label: selectedLabel } = item || {};
    const value = customOption ? selectedLabel : id;
    const updateSelectionCallback = () => updateSelection(selections, value);
    if (typeof onChange === 'function') {
      onChange({ selections, updateSelection: updateSelectionCallback });
    } else {
      updateSelectionCallback();
    }
  }

  function handleKeyDown(e) {
    if (!allowNew) return;
    if (e.keyCode === 13) {
      const { value } = e.target;
      const selectedValue = [
        {
          id: value,
          label: value,
        },
      ];
      const updateSelectionCallback = () => updateSelection(selectedValue, value);
      if (typeof onChange === 'function') {
        onChange({ selections: selectedValue, updateSelection: updateSelectionCallback, value });
      } else {
        updateSelectionCallback();
      }
      typeaheadRef.current.hideMenu();
    }
  }

  useEffect(() => {
    const paramValue = initialQueryParams[paramKey];
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
      const updateSelectionCallback = () => updateSelection(selectedValue, paramValue);
      if (typeof onChange === 'function') {
        onChange({ selections: selectedValue, updateSelection: updateSelectionCallback, value: paramValue });
      } else {
        updateSelectionCallback();
      }
      dispatch(action({ key: paramKey, value: paramValue }));
      setSelected(selectedValue);
    }

    return function cleanup() {
      if (typeof clear === 'function') dispatch(clear(paramKey));
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, allowNew, clear, dispatch, JSON.stringify(options), paramKey, JSON.stringify(initialQueryParams)]);

  useEffect(() => {
    if (selectedValues.length > 0) {
      const { id: value } = selectedValues[0];
      dispatch(action({ key: paramKey, value }));
      setSelected(selectedValues);
      setQueryParams({ [paramKey]: value });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, dispatch, paramKey, JSON.stringify(selectedValues), setQueryParams]);

  useEffect(() => {
    if (getOptions) dispatch(getOptions());
  }, [dispatch, getOptions]);

  function handleFocus(e) {
    if (clearOnClick) {
      setSelected([]);
    }
  }

  return (
    <div className={`list__filters--item form-group__element filter-${paramKey.includes('.') ? paramKey.split('.')[0] : paramKey}`}>
      {label && <label htmlFor={paramKey}>{label}</label>}
      <Typeahead
        allowNew={allowNew}
        clearButton={clearButton}
        id={paramKey}
        inputProps={{ id: paramKey, ...inputProps }}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        options={options}
        ref={typeaheadRef}
        renderInput={renderTypeaheadInput}
        renderMenu={renderTypeaheadMenu}
        selected={selected}
        onFocus={handleFocus}
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
  clearOnClick: PropTypes.bool,
};

export default withRouter(withQueryParams()(connect()(Dropdown)));
