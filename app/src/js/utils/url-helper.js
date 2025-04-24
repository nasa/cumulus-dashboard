/* eslint-disable import/no-cycle */
import get from 'lodash/get';
import queryString from 'query-string';

/**
 * Retrieve initial value for component based on react-router's location.
 *
 * @param {Object} props - react component props
 * @returns {string} - value of this component's query string from the url .
 */
export function getInitialValueFromLocation (props) {
  const { location, paramKey, queryParams } = props;
  // eslint-disable-next-line lodash/path-style
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
  const parsedQueryParams = queryString.parse(location.search);
  const { startDateTime, endDateTime } = parsedQueryParams;
  return queryString.stringify({ startDateTime, endDateTime });
}
