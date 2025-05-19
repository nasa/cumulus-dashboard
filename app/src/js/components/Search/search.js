import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { get } from 'object-path';
import {
  renderSearchInput,
  renderSearchMenu,
} from '../../utils/typeahead-helpers';
import { withUrlHelper } from '../../withUrlHelper';

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
  inputProps = {
    className: 'search',
  },
  label,
  labelKey,
  options,
  paramKey = 'search',
  placeholder,
  searchKey = '',
  urlHelper,
  ...rest
}) => {
  const dispatch = useDispatch();
  const searchRef = useRef();
  const {
    location,
    queryParams,
    getInitialValueFromLocation,
    historyPushWithQueryParams,
  } = urlHelper;
  const formID = `form-${label}-${paramKey}`;
  const initialValueRef = getInitialValueFromLocation(paramKey);
  const searchList = useSelector((state) => get(state, `${searchKey}.list`));
  const { data: searchOptions, inflight = false } = searchList || {};

  useEffect(() => {
    dispatch(clear(paramKey));
  }, [clear, dispatch, paramKey]);

  useEffect(() => {
    if (initialValueRef.current) {
      dispatch(action(initialValueRef.current));
    }
  }, [action, dispatch, initialValueRef]);

  // Handle location changes (browser back/forward)
  useEffect(() => {
    const searchValue = queryParams[paramKey];
    if (searchValue) {
      dispatch(action(searchValue));
    } else {
      dispatch(clear());
    }
  }, [location, queryParams, paramKey, action, clear, dispatch]);

  const handleSearch = useCallback(
    (query) => {
      if (query) dispatch(action(query));
      else dispatch(clear);
    },
    [action, clear, dispatch]
  );

  function handleChange(selections) {
    if (selections && selections.length > 0) {
      const query = selections[0][labelKey];
      dispatch(action(query));
      historyPushWithQueryParams({ [paramKey]: query });
    } else {
      dispatch(clear());
      historyPushWithQueryParams({ [paramKey]: undefined });
    }
  }

  function handleInputChange(text) {
    if (text) {
      historyPushWithQueryParams({ [paramKey]: text });
    } else {
      dispatch(clear());
      historyPushWithQueryParams({ [paramKey]: undefined });
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
    <div className='search__box'>
      {label && (
        <label htmlFor='search' form={formID}>
          {label}
        </label>
      )}
      <form className='search__wrapper form-group__element'>
        <AsyncTypeahead
          defaultInputValue={initialValueRef.current}
          highlightOnlyResult={true}
          id='search'
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
          renderMenu={(results, menuProps) => renderSearchMenu(results, menuProps, labelKey)
          }
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
  options: PropTypes.array,
  query: PropTypes.object,
  searchKey: PropTypes.string,
  placeholder: PropTypes.string,
  urlHelper: PropTypes.shape({
    location: PropTypes.object,
    queryParams: PropTypes.object,
    getInitialValueFromLocation: PropTypes.func,
    historyPushWithQueryParams: PropTypes.func,
  }),
};

export default withUrlHelper(Search);
