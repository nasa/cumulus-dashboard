'use strict';
export const urlDateFormat = 'YYYYMMDDHHmmSS';

// These are just to keep related concepts together in code.
const matchObjects = [
  { dateProp: 'startDateTime', filterProp: '__from' },
  { dateProp: 'endDateTime', filterProp: '__to' }
];

export const urlDateProps = matchObjects.map((o) => o.dateProp);
export const timestampFilters = matchObjects.map(
  (o) => `timestamp${o.filterProp}`
);

export const fetchCurrentTimeFilters = (datepicker) => {
  const filters = {};
  matchObjects.map((o) => {
    if (datepicker[o.dateProp] !== null) {
      filters[`timestamp${o.filterProp}`] = datepicker[o.dateProp].valueOf();
    }
  });
  return filters;
};
