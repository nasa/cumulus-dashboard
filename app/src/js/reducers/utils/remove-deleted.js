import objectPath from 'object-path';
// manually filter out list items that have been deleted.
// https://github.com/nasa/cumulus-dashboard/issues/276
const removeDeleted = (accessor, list, deleted) => {
  const filterByDeletedSuccess = (item) => {
    const id = objectPath.get(item, accessor);
    const record = deleted[id];
    return !(record && objectPath.get(record, 'status') === 'success');
  };
  return list ? list.filter(filterByDeletedSuccess) : [];
};

export default removeDeleted;
