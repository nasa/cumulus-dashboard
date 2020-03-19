'use strict';

import {
  DATEPICKER_DATECHANGE,
  DATEPICKER_DROPDOWN_FILTER,
  DATEPICKER_HOUR_FORMAT
} from '../actions/types';
import { msPerDay, allDateRanges } from '../utils/datepicker';

// Also becomes default props for Datepicker
export const initialState = () => {
  const now = new Date(Date.now());
  return {
    startDateTime: new Date(now - msPerDay),
    endDateTime: null,
    dateRange: allDateRanges.find((a) => a.value === 'Recent'),
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
      endDateTime - timeDeltaInDays * msPerDay
    );
  }
  return { startDateTime, endDateTime };
};

/**
* Sets the state for recent data start time is 24 hours ago, end time is null
*
* @returns {Object} with startDateTime and dateRange set to "Recent"
*/
const recentData = () => {
  const endDateTime = null;
  const startDateTime = new Date(Date.now() - msPerDay);
  return {startDateTime, endDateTime, dateRange: allDateRanges.find((a) => a.value === 'Recent')};
};

export default function reducer (state = initialState(), action) {
  state = { ...state };
  const { data } = action;
  switch (action.type) {
    case DATEPICKER_DROPDOWN_FILTER:
      switch (data.dateRange.label) {
        case 'Custom':
        case 'All':
          return {...state, ...data, ...{startDateTime: null, endDateTime: null}};
        case 'Recent':
          return {...state, ...data, ...recentData()};
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
