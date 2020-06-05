import React from 'react';
import isEqual from 'lodash.isequal';

export const withQueryWrapper = (
  Component,
  queryOptions,
  setQueryOptions
) => (props) => {
  function onQueryChange (newQueryOptions) {
    if (!isEqual(newQueryOptions, queryOptions)) {
      setQueryOptions(newQueryOptions);
    }
  }
  return (
    <Component onQueryChange={onQueryChange} {...props} />
  );
};
