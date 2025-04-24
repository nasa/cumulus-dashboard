import React from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import queryString from 'query-string';

// Utility functions
export function getPersistentQueryParams(location = {}) {
  const parsedQueryParams = queryString.parse(location.search);
  const { startDateTime, endDateTime } = parsedQueryParams;
  return queryString.stringify({ startDateTime, endDateTime });
}

export function filterQueryParams(queryParams = {}) {
  const { startDateTime, endDateTime, search, ...filteredQueryParams } = queryParams;
  return filteredQueryParams;
}

export function historyPushWithQueryParams(navigate, location, path) {
  const persistentParams = getPersistentQueryParams(location);
  const newPath = persistentParams ? `${path}?${persistentParams}` : path;
  navigate(newPath);
}

// Get initial values helpers
export function getInitialValueFromLocation(location, paramKey) {
  const params = new URLSearchParams(location.search);
  return params.get(paramKey) || '';
}

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

export function withUrlHelper(Component) {
  function ComponentWithUrlHelper(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const isAuthenticated = useSelector((state) => state.api.authenticated);

    const urlHelper = {
      location,
      navigate,
      params,
      isAuthenticated,
      historyPushWithQueryParams: (path) => historyPushWithQueryParams(navigate, location, path),
      getPersistentQueryParams: () => getPersistentQueryParams(location),
      getInitialValueFromLocation: (paramKey) => getInitialValueFromLocation(location, paramKey),
      initialValuesFromLocation: (paramKeys) => initialValuesFromLocation(location, paramKeys),
      filterQueryParams,
      queryParams: queryString.parse(location.search),

      requireAuth: () => {
        if (!isAuthenticated) {
          navigate('/auth');
        }
      },
      checkAuth: () => {
        if (isAuthenticated) {
          navigate('/');
        }
      }
    };

    return <Component {...props} urlHelper={urlHelper} />;
  }

  // Set display name for debugging purposes
  ComponentWithUrlHelper.displayName = `WithUrlHelper(${Component.displayName || Component.name || 'Component'})`;

  return ComponentWithUrlHelper;
}
