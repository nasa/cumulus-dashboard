'use strict';

import {
  DATEPICKER_DATECHANGE,
  DATEPICKER_DROPDOWN_FILTER,
  DATEPICKER_HOUR_FORMAT
} from '../actions/types';
import { secondsPerDay, allDateRanges } from '../utils/datepicker';
const earliestDate = new Date(0);

const daysToMilliseconds = 1000 * secondsPerDay;

// Also becomes default props for Datepicker
export const initialState = () => {
  const now = new Date(Date.now());
  return {
    startDateTime: new Date(now - daysToMilliseconds),
    endDateTime: new Date(now),
    dateRange: allDateRanges.find((a) => a.value === 1),
    hourFormat: '12HR'
  };
};

/**
 * Computes the desired time range from present.
 *
 * @param {string} timeDeltaInDays - a number representing the number of days to
 *                                   compute a time offset for.
 * @returns {Object} startDateTime/endDatetime, corresponding to the desired dateRange.
 */
const computeDateTimeDelta = (timeDeltaInDays) => {
  let endDateTime = null;
  let startDateTime = null;

  if (!isNaN(timeDeltaInDays)) {
    endDateTime = new Date(Date.now());
    startDateTime = new Date(
      endDateTime - timeDeltaInDays * daysToMilliseconds
    );
  }
  return { startDateTime, endDateTime };
};

/**
* Sets the state for all data between Jan 1, 1970 and now.
*
* @returns {Object} with startDateTime, endDateTime and dateRange set to "All"
*/
const allData = () => {
  const endDateTime = new Date(Date.now());
  const startDateTime = new Date(earliestDate);
  return {startDateTime, endDateTime, dateRange: allDateRanges.find((a) => a.value === 1)};
};

export default function reducer (state = initialState(), action) {
  state = { ...state };
  const { data } = action;
  switch (action.type) {
    case DATEPICKER_DROPDOWN_FILTER:
      switch (data.dateRange.label) {
        case 'Custom':
          return {...state, ...data};
        case 'All':
          return {...state, ...allData(), ...data};
        default:
          return {...state, ...computeDateTimeDelta(data.dateRange.value), ...data};
      }
    case DATEPICKER_DATECHANGE:
      state = { ...state, ...data };
      break;
    case DATEPICKER_HOUR_FORMAT:
      state = { ...state, ...{hourFormat: data} };
  }
  return state;
}
