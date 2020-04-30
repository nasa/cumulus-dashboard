'use strict';

import {
  DATEPICKER_DATECHANGE,
  DATEPICKER_DROPDOWN_FILTER,
  DATEPICKER_HOUR_FORMAT
} from '../actions/types';
import { msPerDay, allDateRanges } from '../utils/datepicker';
import { createReducer } from '@reduxjs/toolkit';

// Also becomes default props for Datepicker
export const initialState = () => {
  return {
    startDateTime: null,
    endDateTime: null,
    dateRange: allDateRanges.find((a) => a.value === 'Custom'),
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
    endDateTime = Date.now();
    startDateTime = endDateTime - timeDeltaInDays * msPerDay;
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
  const startDateTime = Date.now() - msPerDay;
  return { startDateTime, endDateTime, dateRange: allDateRanges.find((a) => a.value === 'Recent') };
};

export default createReducer(initialState(), {

  [DATEPICKER_DROPDOWN_FILTER]: (state, action) => {
    const { data } = action;
    switch (data.dateRange.label) {
      case 'Custom':
      case 'All':
        return { ...state, ...data, startDateTime: null, endDateTime: null };
      case 'Recent':
        return { ...state, ...data, ...recentData() };
      default:
        return { ...state, ...computeDateTimeDelta(data.dateRange.value), ...data };
    }
  },
  [DATEPICKER_DATECHANGE]: (state, action) => {
    const { data } = action;
    return { ...state, ...data };
  },
  [DATEPICKER_HOUR_FORMAT]: (state, action) => {
    const { data } = action;
    return { ...state, hourFormat: data };
  }
});
