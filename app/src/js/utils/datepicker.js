'use strict';

export const urlDateFormat = 'YYYYMMDDHHmmSS';

// These are created as lists of objects so that we can keep them together when
// mapping over the possible values.
const matchObjects = [
  { dateProp: 'startDateTime', filterProp: '__from' },
  { dateProp: 'endDateTime', filterProp: '__to' }
];

export const urlDateProps = matchObjects.map((o) => o.dateProp);

/**
 * Build a timefilter object that will be passed to the cumulus core API calls as part of the querystring.
 *
 * @param {Object} datepicker - redux datepicker state.
 * @return {Object} object suitable to passing to a request querystring that will contain
 */
export const fetchCurrentTimeFilters = (datepicker) => {
  const filters = {};
  matchObjects.map((o) => {
    if (datepicker[o.dateProp] !== null) {
      filters[`timestamp${o.filterProp}`] = datepicker[o.dateProp].valueOf();
    }
  });
  return filters;
};
