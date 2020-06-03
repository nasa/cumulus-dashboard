import get from 'lodash.get';
import isEqual from 'lodash/isEqual';

export const needsSelectedIdsQueryUpdate = (queryObject = {}, selected) => {
  const currentIds = get(queryObject, 'ids', []);
  return queryObject && !isEqual(selected.sort(), currentIds.sort());
};
