'use strict';
import get from 'lodash.get';
import isEmpty from 'lodash.isempty';

/**
 * Retrieve initial value for component based on react-router's location.
 *
 * @param {Object} props - react component props
 * @returns {string} - value of this component's query string from the url .
 */
export function initialValueFromLocation (props) {
  const { location, paramKey } = props;
  let initialValue = '';
  if (!isEmpty(location.query) &&
       Object.hasOwnProperty.call(location.query, paramKey)) {
    initialValue = location.query[paramKey];
  }
  return initialValue;
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
 * Actions in the component should be reflected in the URL. This function
 * pushes updated location information onto the router
 *
 * @param {Object} router - react-router router
 * @param {Object} location enhanced react-router location
 * @param {string} paramKey -query parameter to change
 * @param {string} value - query parameter's value to set
 */
export function updateRouterLocation (router, location, paramKey, value) {
  let nextQuery = { ...location.query };
  if (value.length) {
    nextQuery = { ...nextQuery, [paramKey]: value };
  } else {
    delete nextQuery[paramKey];
  }
  if (location.query[paramKey] !== nextQuery[paramKey]) {
    location.query = nextQuery;
    router.push(location);
  }
}
