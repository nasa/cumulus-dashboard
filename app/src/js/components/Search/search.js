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
 * @description Search component with explicit Search button
 * @param {string} labelKey The property of the search results that will be displayed in the dropdown menu
 * @param {string} paramKey The parameter that should be appended to the url when searching
 * @param {string} searchKey This defines what is being searched (ex: collections, granules, rules, etc)
 * @param {boolean} archived Whether to include archived records in search
 */

const Search = ({
  action,
  clear,
  dispatch,
  infixBoolean,
  archived = false,
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
  minSearchLength = 2,
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

  useEffect(() => {
    const currentValue = getInitialValueFromLocation({
      location,
      paramKey,
      queryParams,
    });
    setInputValue(currentValue || '');
  }, [location, paramKey, queryParams]);

  // Handle infixBoolean toggle - reset pagination when it changes
  useEffect(() => {
    if (prevInfixBoolean.current !== infixBoolean && prevInfixBoolean.current !== undefined) {
      const currentValue = getInitialValueFromLocation({
        location,
        paramKey,
        queryParams,
      });

      if (currentValue) {
        // Reset to page 1 when changing search type, preserve other params
        setQueryParams({ ...queryParams, page: 1 });
      }
    }
    prevInfixBoolean.current = infixBoolean;
  }, [infixBoolean, location, paramKey, queryParams, setQueryParams]);

  // Handle URL sync and search execution
  useEffect(() => {
    const currentUrlSearchValue = getInitialValueFromLocation({
      location,
      paramKey,
      queryParams,
    });

    if (currentUrlSearchValue && currentUrlSearchValue.length >= minSearchLength) {
      dispatch(action(currentUrlSearchValue, infixBoolean, archived));
    } else if (!currentUrlSearchValue) {
      dispatch(clear(paramKey));
    }
  }, [queryParams, minSearchLength, dispatch, action, clear, infixBoolean, archived, location, paramKey]);

  const validateSearchTerm = useCallback((term) => {
    const trimmedTerm = term.trim();

    // Check minimum length
    if (minSearchLength && trimmedTerm.length < minSearchLength) {
      return {
        valid: false,
        error: `Please enter at least ${minSearchLength} characters to search`
      };
    }

    // Check for repeated characters (like "AAA")
    if (trimmedTerm.length <= 5 && /^(.)\1+$/.test(trimmedTerm)) {
      return {
        valid: false,
        error: 'Please use a more specific search term (avoid repeated characters)'
      };
    }

    return { valid: true };
  }, [minSearchLength]);

  const handleSearchClick = useCallback(() => {
    if (searchRef.current) {
      searchRef.current.hideMenu();
    }

    // Block handleChange from triggering
    blockHandleChange.current = true;
    setTimeout(() => {
      blockHandleChange.current = false;
    }, 100);

    // Get the actual value from the input element
    const inputElement = searchRef.current?.getInput();
    const currentInputValue = inputElement ? inputElement.value : inputValue;
    const trimmedValue = (currentInputValue || '').trim();

    setInputValue(trimmedValue);

    if (trimmedValue) {
      const validation = validateSearchTerm(trimmedValue);
      if (!validation.valid) {
        setValidationError(validation.error);
        return;
      }

      setValidationError('');
      // Update URL, reset to page 1 - search execution is handled by useEffect
      setQueryParams({ ...queryParams, [paramKey]: trimmedValue, page: 1 });
    } else {
      setValidationError('');
      setQueryParams({ ...queryParams, [paramKey]: undefined, page: 1 });
    }
  }, [searchRef, inputValue, validateSearchTerm, paramKey, setQueryParams, queryParams]);

  function handleChange(selections) {
    // Don't process onChange if we just clicked search button - prevents double trigger
    if (blockHandleChange.current) {
      return;
    }

    if (selections && selections.length > 0) {
      const query = selections[0][labelKey];
      const trimmedQuery = query ? query.trim() : '';

      if (trimmedQuery) {
        setInputValue(trimmedQuery);

        const validation = validateSearchTerm(trimmedQuery);
        if (!validation.valid) {
          setValidationError(validation.error);
          return;
        }

        setValidationError('');
        setQueryParams({ ...queryParams, [paramKey]: trimmedQuery, page: 1 });
      } else {
        setInputValue('');
        setValidationError('');
        setQueryParams({ ...queryParams, [paramKey]: undefined, page: 1 });
      }
    } else if (inputValue === '') {
      // If the input was cleared and selections are empty, clear the search
      setValidationError('');
      setQueryParams({ ...queryParams, [paramKey]: undefined, page: 1 });
    }
  }

  function handleInputChange(text) {
    setInputValue(text);
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

      if (searchRef.current) {
        searchRef.current.hideMenu();
      }

      blockHandleChange.current = true;
      setTimeout(() => {
        blockHandleChange.current = false;
      }, 100);

      const trimmedValue = (event.target.value || '').trim();
      setInputValue(trimmedValue);

      if (trimmedValue) {
        const validation = validateSearchTerm(trimmedValue);
        if (!validation.valid) {
          setValidationError(validation.error);
          return;
        }
        setValidationError('');
        setQueryParams({ ...queryParams, [paramKey]: trimmedValue, page: 1 });
      } else {
        setValidationError('');
        setQueryParams({ ...queryParams, [paramKey]: undefined, page: 1 });
      }
    }
  }

  // No-op: we control search via the Search button, not on every keystroke
  // eslint-disable-next-line lodash/prefer-noop
  const handleSearch = useCallback(() => {}, []);

  return (
    <div className="search__box">
      {label && (
        <label htmlFor="search" form={formID}>
          {label}
        </label>
      )}
      <form className="search__wrapper form-group__element" style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
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
          </div>
          <button
              type="button"
              className="button button--small button--search"
              onClick={handleSearchClick}
              aria-label="Search"
              style={{
                flexShrink: 0,
                height: '28px',
                padding: '0 1.5rem',
                marginTop: 0,
                marginLeft: '1rem',
                alignSelf: 'flex-start',
              }}
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
  archived: PropTypes.bool,
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
