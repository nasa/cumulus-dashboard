'use strict';
import get from 'lodash.get';
import queryString from 'query-string';
import { history } from '../store/configureStore';

/**
 * Retrieve initial value for component based on react-router's location.
 *
 * @param {Object} props - react component props
 * @returns {string} - value of this component's query string from the url .
 */
export function initialValueFromLocation (props) {
  const { location, paramKey, queryParams } = props;
  return get(location, ['query', paramKey], get(queryParams, paramKey, ''));
}

/**
 * Retrieve initial values for component parameters based on react-router's location.
 *
 * @param {Object} location - react-router's location
 * @param {Array<string>} paramsKeys - list of parameter keys
 * @returns {Object} - object with parameters and values from the url
 */
export function initialValuesFromLocation (location, paramKeys) {
  const initialValues = {};
  paramKeys.forEach((paramKey) => {
    const paramValue = get(location, `query.${paramKey}`, null);
    if (paramValue) {
      initialValues[paramKey] = paramValue;
    }
  });
  return initialValues;
}

/**
 * Returns a location.search string containing only the params that should persist across pages
 *
 * @param {Object} location - react-router's location
 */

export function getPersistentQueryParams(location = {}) {
  const parsedQueryParams = queryString.parse(location.search);
  const { startDateTime, endDateTime } = parsedQueryParams;
  return queryString.stringify({ startDateTime, endDateTime });
}

export function historyPushWithQueryParams(path) {
  const { location } = history;
  history.push({
    pathname: path,
    search: getPersistentQueryParams(location)
  });
}
