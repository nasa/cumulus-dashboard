// HOC wrapper to replace url-helper.js with React Router v6 query changes
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // these hooks are used for queries
import queryString from 'query-string';

// Utility functions
/**
 * Retrieve initial value for component based on react-router's location.
 *
 * @param {Object} location - react-router's location object
 * @param {string} paramKey - the key of the parameter to retrieve
 * @returns {string} - value of this component's query string from the url.
 */
export function getInitialValueFromLocation(location, paramKey) {
  const params = new URLSearchParams(location.search);
  return params.get(paramKey) || '';
}

/**
 * Retrieve initial values for component parameters based on react-router's location.
 *
 * @param {Object} location - react-router's location object
 * @param {Array<string>} paramKeys - list of parameter keys
 * @returns {Object} - object with parameters and values from the url
 */
export function initialValuesFromLocation(location, paramKeys) {
  const params = new URLSearchParams(location.search);
  const initialValues = {};
  paramKeys.forEach((paramKey) => {
    const paramValue = params.get(paramKey);
    if (paramValue) {
      initialValues[paramKey] = paramValue;
    }
  });
  return initialValues;
}

/**
 * Returns filtered queryParams
 *
 * @param {Object} queryParams - object where key/value pairs are the queryparam and its value
 */
export function filterQueryParams(queryParams = {}) {
  const { startDateTime, endDateTime, search, ...filteredQueryParams } =
    queryParams;
  return filteredQueryParams;
}

/**
 * Returns a location.search string containing only the params that should persist across pages
 *
 * @param {Object} location - react-router's location object
 */
export function getPersistentQueryParams(location) {
  const parsedQueryParams = queryString.parse(location.search);
  const { startDateTime, endDateTime } = parsedQueryParams;
  return queryString.stringify({ startDateTime, endDateTime });
}

// Higher-Order Component (HOC) for Wrapper
export function withUrlHelper(Component) {
  function ComponentWithUrlHelper(props) {
    const navigate = useNavigate();
    const location = useLocation();

    /**
     * Calls history while preserving the queryParams that should persist across pages
     *
     * @param {string} path the path to be passed to history
     */
    const historyPushWithQueryParams = (path) => {
      const persistentParams = getPersistentQueryParams(location);
      const newPath = persistentParams ? `${path}?${persistentParams}` : path;
      navigate(newPath);
    };

    const urlHelper = {
      location,
      navigate,
      historyPushWithQueryParams,
      getPersistentQueryParams: () => getPersistentQueryParams(location),
      getInitialValueFromLocation: (paramKey) => getInitialValueFromLocation(location, paramKey),
      initialValuesFromLocation: (paramKeys) => initialValuesFromLocation(location, paramKeys),
      filterQueryParams,
    };

    return <Component {...props} urlHelper={urlHelper} />;
  }

  // Set display name for debugging purposes
  ComponentWithUrlHelper.displayName = `WithUrlHelper(${Component.displayName || Component.name || 'Component'})`;

  return ComponentWithUrlHelper;
}
