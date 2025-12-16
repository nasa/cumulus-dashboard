import React, { createRef, useCallback, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import withQueryParams from 'react-router-query-params';
import { withRouter } from 'react-router-dom';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { get } from 'object-path';
// import debounce from 'lodash/debounce';
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
  minSearchLength = 3,
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
  const [inputValue, setInputValue] = React.useState(initialValueRef.current || '');
  const [validationError, setValidationError] = React.useState('');
  const blockHandleChange = useRef(false);
  const prevInfixBoolean = useRef(infixBoolean);

  useEffect(() => {
    dispatch(clear(paramKey));
  }, [clear, dispatch, paramKey]);

  // handleSearch is called by AsyncTypeahead on every keystroke
  // We don't want to update URL or dispatch on every keystroke
  // Only the Search button should trigger the actual search
  // eslint-disable-next-line lodash/prefer-noop
  const handleSearch = useCallback(() => {
    // No-op: we control search via the Search button, not on every keystroke
  }, []);

  // Handle initial value from URL on mount
  useEffect(() => {
    if (initialValueRef.current) {
      dispatch(action(initialValueRef.current, infixBoolean));
    }
  }, [action, infixBoolean, dispatch]);

  useEffect(() => {
    const currentValue = getInitialValueFromLocation({
      location,
      paramKey,
      queryParams,
    });
    setInputValue(currentValue || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, paramKey]);

  // Handle infixBoolean toggle - retrigger search when it changes
  useEffect(() => {
    // Only retrigger if infixBoolean actually changed
    if (prevInfixBoolean.current !== infixBoolean && prevInfixBoolean.current !== undefined) {
      const currentValue = getInitialValueFromLocation({
        location,
        paramKey,
        queryParams,
      });

      // If there's a search value, retrigger the search with the new infix mode
      if (currentValue) {
        dispatch(action(currentValue, infixBoolean));
        // Reset to page 1 when changing search type, preserve other params
        setQueryParams({ ...queryParams, page: 1 });
      }
    }

    // Update the previous value
    prevInfixBoolean.current = infixBoolean;
  }, [infixBoolean, action, dispatch, location, paramKey, queryParams, setQueryParams]);

  const validateSearchTerm = useCallback((term) => {
    const trimmedTerm = term.trim();

    console.log('🔍 Search Validation:', {
      original: term,
      trimmed: trimmedTerm,
      length: trimmedTerm.length,
      minRequired: minSearchLength
    });

    // Check minimum length
    if (minSearchLength && trimmedTerm.length < minSearchLength) {
      console.log('BLOCKED: Too short');
      return {
        valid: false,
        error: `Please enter at least ${minSearchLength} characters to search`
      };
    }

    // Check for repeated characters (like "AAA")
    // These often match too many records and cause timeouts
    if (trimmedTerm.length <= 5) {
      // If it's all the same character repeated
      if (/^(.)\1+$/.test(trimmedTerm)) {
        console.log('BLOCKED: Repeated characters');
        return {
          valid: false,
          error: 'Please use a more specific search term (avoid repeated characters)'
        };
      }
    }

    console.log('VALID: Search will proceed');
    return { valid: true };
  }, [minSearchLength]);

  const handleSearchClick = useCallback(() => {
    console.log('🔘 Search Button Clicked');

    // Close the dropdown menu first
    if (searchRef.current) {
      searchRef.current.hideMenu();
    }

    // Block handleChange from triggering for a brief moment
    blockHandleChange.current = true;
    setTimeout(() => {
      blockHandleChange.current = false;
    }, 100);

    // Get the actual value from the input element
    const inputElement = searchRef.current?.inputNode;
    const currentInputValue = inputElement ? inputElement.value : inputValue;
    const trimmedValue = currentInputValue.trim();

    console.log('📝 Search Input:', {
      fromDOM: currentInputValue,
      fromState: inputValue,
      trimmed: trimmedValue,
      willUse: trimmedValue
    });

    // Update our state to match what we're searching for
    setInputValue(trimmedValue);

    if (trimmedValue) {
      // Validate search term
      const validation = validateSearchTerm(trimmedValue);
      if (!validation.valid) {
        console.log('Validation FAILED, showing error');
        setValidationError(validation.error);
        return;
      }

      // Clear any previous validation error
      setValidationError('');

      console.log('Dispatching search action:', {
        term: trimmedValue,
        infixMode: infixBoolean,
        paramKey
      });

      // Dispatch action AND update URL, reset to page 1
      dispatch(action(trimmedValue, infixBoolean));
      setQueryParams({ ...queryParams, [paramKey]: trimmedValue, page: 1 });
    } else {
      console.log('Empty search, clearing filter');

      // Clear validation error for empty search
      setValidationError('');

      // Empty search - clear the filter to show all results, reset to page 1
      dispatch(clear(paramKey));
      setQueryParams({ ...queryParams, [paramKey]: undefined, page: 1 });
    }
  }, [searchRef, inputValue, validateSearchTerm, infixBoolean,
    paramKey, dispatch, action, setQueryParams, queryParams, clear]);

  function handleChange(selections) {
    // Don't process onChange if we just clicked search button/pressed Enter - prevents double trigger
    if (blockHandleChange.current) {
      return;
    }

    if (selections && selections.length > 0) {
      const query = selections[0][labelKey];
      const trimmedQuery = query ? query.trim() : '';

      if (trimmedQuery) {
        setInputValue(trimmedQuery);

        // Validate search term
        const validation = validateSearchTerm(trimmedQuery);
        if (!validation.valid) {
          setValidationError(validation.error);
          return;
        }

        // Clear any previous validation error
        setValidationError('');

        // Like Dropdown: dispatch action AND update URL, reset to page 1
        dispatch(action(trimmedQuery, infixBoolean));
        setQueryParams({ ...queryParams, [paramKey]: trimmedQuery, page: 1 });
      } else {
        // Selected item is empty/whitespace - clear search
        setInputValue('');
        setValidationError('');
        dispatch(clear(paramKey));
        setQueryParams({ ...queryParams, [paramKey]: undefined, page: 1 });
      }
    }
  }

  function handleInputChange(text) {
    setInputValue(text);
    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError('');
    }
  }

  function handleFocus(event) {
    event.target.select();
  }

  function handleKeyDown(event) {
    if (event.keyCode === 13) {
      // Check if there's a highlighted autocomplete item
      const typeaheadInstance = searchRef.current;
      const isMenuOpen = typeaheadInstance?.state?.showMenu;
      const activeIndex = typeaheadInstance?.state?.activeIndex;
      const hasHighlightedItem = isMenuOpen && activeIndex !== -1 && activeIndex !== undefined;

      if (hasHighlightedItem) {
        return;
      }

      // No highlighted item - treat Enter as clicking the Search button
      event.preventDefault();

      // Get the actual current value from the input element
      const inputElement = event.target;
      const currentInputValue = inputElement ? inputElement.value : inputValue;

      searchRef.current.hideMenu();

      // Block handleChange from triggering for a brief moment
      blockHandleChange.current = true;
      setTimeout(() => {
        blockHandleChange.current = false;
      }, 100);

      const trimmedValue = currentInputValue.trim();

      setInputValue(trimmedValue);

      if (trimmedValue) {
        const validation = validateSearchTerm(trimmedValue);
        if (!validation.valid) {
          setValidationError(validation.error);
          return;
        }
        setValidationError('');
        dispatch(action(trimmedValue, infixBoolean));
        setQueryParams({ ...queryParams, [paramKey]: trimmedValue, page: 1 });
      } else {
        setValidationError('');
        dispatch(clear(paramKey));
        setQueryParams({ ...queryParams, [paramKey]: undefined, page: 1 });
      }
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
          defaultInputValue={inputValue}
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
          minLength={1}
        />
        <button
          type="button"
          className="button button--small button--search"
          onClick={handleSearchClick}
          aria-label="Search"
        >
          Search
        </button>
      </form>
      {validationError
        ? (
          <div className="search__error" style={{
            color: '#e74c3c',
            fontSize: '0.875rem',
            marginTop: '0.25rem',
            padding: '0.5rem',
            backgroundColor: '#fee',
            borderRadius: '4px',
            border: '1px solid #fcc'
          }}>
             {validationError}
          </div>
          )
        : (
          <div className="search__tip" style={{
            color: '#666',
            fontSize: '0.75rem',
            marginTop: '0.25rem',
            fontStyle: 'italic'
          }}>
            Tip: Use specific terms (e.g., "MOD0ABC" instead of "MOD").
            If search times out, try using Status, Collection, or Provider filters instead.
          </div>
          )}
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
  minSearchLength: PropTypes.number,
};

export default withRouter(withQueryParams()(connect((state) => state)(Search)));
