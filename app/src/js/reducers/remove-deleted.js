'use strict';
import { get } from 'object-path';
// manually filter out list items that have been deleted.
// https://github.com/nasa/cumulus-dashboard/issues/276
const removeDeleted = (accessor, list, deleted) => {
  const filterByDeletedSuccess = function (item) {
    const id = get(item, accessor);
    let record = deleted[id];
    return !(record && get(record, 'status') === 'success');
  };
  return list.filter(filterByDeletedSuccess);
};

export default removeDeleted;
