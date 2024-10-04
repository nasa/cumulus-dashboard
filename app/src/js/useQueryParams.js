/* eslint prefer-const: "off" */
// hook to use query params for search and pages
import React from 'react';
import { useSearchParams } from 'react-router-dom';

export function getInitialValueFromLocation(props) {
  const { location, paramKey, queryParams } = props;
  return useSearchParams.get(
    location,
    ['query', paramKey],
    useSearchParams.get(queryParams, paramKey, '')
  );
}

export function filterQueryParams(queryParams = {}) {
  const { startDateTime, endDateTime, search, ...filteredQueryParams } =
    queryParams;
  return filteredQueryParams;
}

function useQueryParams(Component) {
  function ComponentUseQueryParamsProp(props) {
    const [searchParams] = useSearchParams();
    let params = {};
    const query = searchParams.get(params);
    return <Component {...props} router={{ query }} />;
  }
  return ComponentUseQueryParamsProp;
}

export default useQueryParams;
