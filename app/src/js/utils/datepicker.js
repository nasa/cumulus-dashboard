'use strict';

export const urlDateFormat = 'YYYYMMDDHHmmSS';
export const secondsPerDay = 60.0 * 60.0 * 24.0;

export const allDateRanges = [
  {value: 'Custom', label: 'Custom'},
  {value: 'Recent', label: 'Recent'},
  {value: 'All', label: 'All'},
  {value: 1 / 24.0, label: '1 hour'},
  {value: 1, label: '1 day'},
  {value: 7, label: '1 week'},
  {value: 30, label: '1 month'},
  {value: 90, label: '90 days'},
  {value: 180, label: '180 days'},
  {value: 366, label: '1 year'}
];
export const allHourFormats = ['12HR', '24HR'];
export const dateTimeFormat = 'YYYY-MM-DDTHH:mm:ss.sss';

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
