import get from 'lodash.get';
import isEqual from 'lodash/isEqual';

export const updateSelectedQueryIds = (
  setQuery,
  jsonQueryString,
  selected
) => {
  let currentQuery;
  try {
    currentQuery = JSON.parse(jsonQueryString);
  } catch (_) {
    return;
  }
  const currentIds = get(currentQuery, 'ids', []);
  if (currentQuery && !isEqual(selected.sort(), currentIds.sort())) {
    setQuery(JSON.stringify({
      ...currentQuery,
      ids: selected
    }, null, 2));
  }
};
