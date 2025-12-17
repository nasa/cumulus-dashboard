/* eslint-disable import/no-cycle */
import get from 'lodash/get';
import queryString from 'query-string';
import { history } from '../store/configureStore';

/**
 * Extracts the query string from location, handling both browser history
 * (location.search) and hash history (query params in location.hash).
 *
 * @param {Object} location - react-router's location object
 * @returns {string} - the query string portion of the URL
 */
function getQueryStringFromLocation(location) {
  if (location?.search) {
    return location.search;
  }
  if (location?.hash?.includes('?')) {
    return location.hash.substring(location.hash.indexOf('?'));
  }
  return '';
}

/**
 * Retrieve initial value for component based on react-router's location.
 * Supports both browser history and hash history.
 *
 * @param {Object} props - react component props
 * @param {Object} props.location - react-router's location object
 * @param {string} props.paramKey - the query parameter key to retrieve
 * @param {Object} [props.queryParams] - fallback query params object
 * @returns {string} - value of this component's query string from the url
 */
export function getInitialValueFromLocation(props) {
  const { location, paramKey, queryParams } = props;

  // First, try to parse from location.search or location.hash
  const queryString = getQueryStringFromLocation(location);
  if (queryString) {
    const params = new URLSearchParams(queryString);
    const value = params.get(paramKey);
    if (value !== null) {
      return value;
    }
  }

  // Fall back to location.query
  const queryValue = get(location, ['query', paramKey]);
  if (queryValue !== undefined) {
    return queryValue;
  }

  // Fall back to queryParams prop
  return get(queryParams, paramKey, '');
}

/**
 * Retrieve initial values for component parameters based on react-router's location.
 * Supports both browser history and hash history.
 *
 * @param {Object} location - react-router's location
 * @param {Array<string>} paramKeys - list of parameter keys
 * @returns {Object} - object with parameters and values from the url
 */
export function initialValuesFromLocation(location, paramKeys) {
  const initialValues = {};

  // First, try to parse from location.search or location.hash
  const queryString = getQueryStringFromLocation(location);
  if (queryString) {
    const params = new URLSearchParams(queryString);
    paramKeys.forEach((paramKey) => {
      const paramValue = params.get(paramKey);
      if (paramValue !== null) {
        initialValues[paramKey] = paramValue;
      }
    });
    return initialValues;
  }

  // Fall back to location.query
  paramKeys.forEach((paramKey) => {
    const paramValue = get(location, `query.${paramKey}`, null);
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
  const { startDateTime, endDateTime, search, ...filteredQueryParams } = queryParams;
  return filteredQueryParams;
}

/**
 * Returns a location.search string containing only the params that should persist across pages
 *
 * @param {Object} location - react-router's location
 */

export function getPersistentQueryParams(location = {}) {
  const queryStringSource = getQueryStringFromLocation(location);
  const parsedQueryParams = queryString.parse(queryStringSource);
  const { startDateTime, endDateTime } = parsedQueryParams;
  return queryString.stringify({ startDateTime, endDateTime });
}

/**
 * Calls history.push while perserving the queryParams that should persist across pages
 *
 * @param {string} path the path to be passed to history.push
 */
export function historyPushWithQueryParams(path) {
  if (!history) return;
  const { location } = history;
  history.push({
    pathname: path,
    search: getPersistentQueryParams(location)
  });
}
