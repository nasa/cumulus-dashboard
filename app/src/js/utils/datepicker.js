export const urlDateFormat = 'YYYYMMDDHHmmSS';
const secondsPerDay = 60.0 * 60.0 * 24.0;
export const msPerDay = secondsPerDay * 1000.0;

export const allDateRanges = [
  { value: 'Custom', label: 'Custom' },
  { value: 'Recent', label: 'Recent' },
  { value: 1 / 24.0, label: '1 hour' },
  { value: 1, label: '1 day' },
  { value: 7, label: '1 week' },
  { value: 30, label: '1 month' },
  { value: 90, label: '3 months' },
  { value: 180, label: '6 months' },
  { value: 366, label: '1 year' }
];

export const findDateRangeByValue = (value) => allDateRanges.find((r) => value === r.value);

export const allHourFormats = [
  { value: '12HR', label: '12HR' },
  { value: '24HR', label: '24HR' }
];
export const dateTimeFormat = 'YYYY-MM-DDTHH:mm:ss.sss';

// These are created as lists of objects so that we can keep them together when
// mapping over the possible values.
const matchObjects = [
  { dateProp: 'startDateTime', filterProp: '__from' },
  { dateProp: 'endDateTime', filterProp: '__to' }
];

export const urlDateProps = matchObjects.map((o) => o.dateProp);

/**
 * look and see if the start/end times of the input object match a dropdown label and return it.
 * @param {Object} values - can contain startDateTime endDateTime
 * @return {Object} returns a matching daterange object, or the custom value if no matches found.
 */
export const dropdownValue = (values) => {
  let dropdownInfo = findDateRangeByValue('Custom');
  if (!!values.startDateTime && !!values.endDateTime) {
    const durationDays = (values.endDateTime - values.startDateTime) / msPerDay;
    dropdownInfo = findDateRangeByValue(durationDays) || dropdownInfo;
  }
  if (values.startDateTime && !values.endDateTime) {
    const durationDays = ((Date.now() - msPerDay) - values.startDateTime) / msPerDay;
    // leave Recent as the tag for upto a day.
    if (durationDays < 1 && durationDays > 0) {
      dropdownInfo = findDateRangeByValue('Recent');
    }
  }
  return dropdownInfo;
};

/**
 * Build a timefilter object that will be passed to the cumulus core API calls as part of the querystring.
 *
 * @param {Object} datepicker - redux datepicker state.
 * @return {Object} object suitable to passing to a request querystring that will contain
 */
export const fetchCurrentTimeFilters = (datepicker) => {
  const filters = {};
  matchObjects.forEach((o) => {
    if (datepicker[o.dateProp] !== null) {
      filters[`timestamp${o.filterProp}`] = datepicker[o.dateProp];
    }
  });
  return filters;
};
