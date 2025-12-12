import React, { createRef, useCallback, useEffect, useMemo, useRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import withQueryParams from 'react-router-query-params';
import { withRouter } from 'react-router-dom';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { get } from 'object-path';
import debounce from 'lodash/debounce';
import noop from 'lodash/noop';
import {
  renderSearchInput,
  renderSearchMenu,
} from '../../utils/typeahead-helpers';

const getQueryParamFromLocation = (location, paramKey) => {
  let queryStringSource = '';
  if (location?.search) {
    queryStringSource = location.search;
  } else if (location?.hash?.includes('?')) {
    queryStringSource = location.hash.substring(location.hash.indexOf('?'));
  }
  const params = new URLSearchParams(queryStringSource);
  return params.get(paramKey) || '';
};

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
  infixBoolean,
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
  // Track the last value we pushed to URL to prevent duplicate pushes
  const lastPushedValueRef = useRef(null);

  const searchRef = createRef();
  const formID = `form-${label}-${paramKey}`;

  // Get current search value from URL (recalculated when location changes)
  const searchValueFromUrl = getQueryParamFromLocation(location, paramKey);
  const searchList = get(rest[searchKey], 'list');
  const { data: searchOptions, inflight = false } = searchList || {};

  // Core search function: updates URL params and dispatches action
  const performSearch = useCallback((query, skipUrlUpdate = false) => {
    const newValue = query || undefined;

    // Skip if this value was already handled (prevents duplicate dispatches)
    if (lastPushedValueRef.current === newValue) {
      return;
    }
    lastPushedValueRef.current = newValue;

    // Update URL (unless skipped, e.g., on initial load from URL)
    if (!skipUrlUpdate) {
      setQueryParams({ [paramKey]: newValue });
    }

    if (newValue) {
      dispatch(action(newValue, infixBoolean));
    } else {
      dispatch(clear(paramKey));
    }
  }, [paramKey, setQueryParams, dispatch, action, infixBoolean, clear]);

  // Debounced version of performSearch (500ms delay)
  const debouncedSearch = useMemo(
    () => debounce((query) => performSearch(query), 500),
    [performSearch]
  );

  // Cleanup debounce on unmount
  useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

  // handleSearch: use debounced search for user input, use immediate search for initial load
  const handleSearch = useCallback((query, skipUrlUpdate = false) => {
    if (skipUrlUpdate) {
      // Initial load - execute immediately without debounce
      performSearch(query, true);
    } else {
      // User input - debounce
      debouncedSearch(query);
    }
  }, [performSearch, debouncedSearch]);

  // Sync search with URL when location changes (initial load or browser navigation)
  // skipUrlUpdate=true because the URL already has the value
  useEffect(() => {
    performSearch(searchValueFromUrl, true);
  }, [searchValueFromUrl, performSearch]);

  // Called when user selects from dropdown
  const handleChange = useCallback((selections) => {
    handleSearch(selections?.[0]?.[labelKey]);
  }, [labelKey, handleSearch]);

  // Called on every input change - handler for all text changes (typing and deletions)
  const handleInputChange = useCallback((text) => {
    handleSearch(text || undefined);
  }, [handleSearch]);

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
          key={searchValueFromUrl} // Remount when URL value changes (e.g., browser navigation)
          defaultInputValue={searchValueFromUrl}
          highlightOnlyResult={true}
          id="search"
          inputProps={{ id: 'search', ...inputProps }}
          isLoading={inflight}
          labelKey={labelKey}
          onChange={handleChange}
          onFocus={handleFocus}
          onInputChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onSearch={noop} // Required prop, but we handle search via onInputChange instead
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
  infixBoolean: PropTypes.bool,
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