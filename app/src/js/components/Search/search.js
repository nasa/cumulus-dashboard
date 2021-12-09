import React, { createRef, useCallback, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import withQueryParams from 'react-router-query-params';
import { withRouter } from 'react-router-dom';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { get } from 'object-path';
import { getInitialValueFromLocation } from '../../utils/url-helper';
import {
  renderSearchInput,
  renderSearchMenu,
} from '../../utils/typeahead-helpers';

/**
 * Search
 * @description Search component
 * @param {string} labelKey The property of the search results that will be displayed in the dropdown menu
 * (ex: for a granule, this would be set to 'granuleId')
 * @param {string} paramKey The parameter that should be appended to the url when searching
 * @param {string} searchKey This defines what is being searched (ex: collections, granules, rules, etc)
 */

const Search = ({
  action,
  clear,
  dispatch,
  inputProps = {
    className: 'search',
  },
  label,
  labelKey,
  location,
  options,
  paramKey = 'search',
  placeholder,
  queryParams,
  searchKey = '',
  setQueryParams,
  ...rest
}) => {
  const searchRef = createRef();
  const formID = `form-${label}-${paramKey}`;
  const initialValueRef = useRef(getInitialValueFromLocation({
    location,
    paramKey,
    queryParams,
  }));
  const searchList = get(rest[searchKey], 'list');
  const { data: searchOptions, inflight = false } = searchList || {};

  useEffect(() => {
    dispatch(clear(paramKey));
  }, [clear, dispatch, paramKey]);

  useEffect(() => {
    if (initialValueRef.current) {
      dispatch(action(initialValueRef.current));
    }
  }, [action, dispatch]);

  const handleSearch = useCallback((query) => {
    if (query) dispatch(action(query));
    else dispatch(clear);
  }, [action, clear, dispatch]);

  function handleChange(selections) {
    if (selections && selections.length > 0) {
      const query = selections[0][labelKey];
      dispatch(action(query));
      setQueryParams({ [paramKey]: query });
    } else {
      dispatch(clear());
      setQueryParams({ [paramKey]: undefined });
    }
  }

  function handleInputChange(text) {
    if (text) {
      setQueryParams({ [paramKey]: text });
    } else {
      dispatch(clear());
      setQueryParams({ [paramKey]: undefined });
    }
  }

  function handleFocus(event) {
    event.target.select();
  }

  function handleKeyDown(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      searchRef.current.hideMenu();
    }
  }

  return (
    <div className="search__box">
      {label && (
        <label htmlFor="search" form={formID}>
          {label}
        </label>
      )}
      <form className="search__wrapper form-group__element">
        <AsyncTypeahead
          defaultInputValue={initialValueRef.current}
          highlightOnlyResult={true}
          id="search"
          inputProps={{ id: 'search', ...inputProps }}
          isLoading={inflight}
          labelKey={labelKey}
          onChange={handleChange}
          onFocus={handleFocus}
          onInputChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onSearch={handleSearch}
          options={searchOptions || options}
          placeholder={placeholder}
          ref={searchRef}
          renderInput={renderSearchInput}
          renderMenu={(results, menuProps) => renderSearchMenu(results, menuProps, labelKey)}
        />
      </form>
    </div>
  );
};

Search.propTypes = {
  dispatch: PropTypes.func,
  action: PropTypes.func,
  clear: PropTypes.func,
  inputProps: PropTypes.object,
  paramKey: PropTypes.string,
  label: PropTypes.any,
  labelKey: PropTypes.string,
  location: PropTypes.object,
  options: PropTypes.array,
  query: PropTypes.object,
  queryParams: PropTypes.object,
  searchKey: PropTypes.string,
  setQueryParams: PropTypes.func,
  placeholder: PropTypes.string,
};

export default withRouter(withQueryParams()(connect((state) => state)(Search)));
