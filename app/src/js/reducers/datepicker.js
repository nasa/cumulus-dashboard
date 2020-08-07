import { createReducer } from '@reduxjs/toolkit';
import { msPerDay, findDateRangeByValue } from '../utils/datepicker';
import {
  DATEPICKER_DATECHANGE,
  DATEPICKER_DROPDOWN_FILTER,
  DATEPICKER_HOUR_FORMAT,
} from '../actions/types';

// Also becomes default props for Datepicker
export const initialState = () => ({
  startDateTime: null,
  endDateTime: null,
  dateRange: findDateRangeByValue('Custom'),
  hourFormat: '12HR'
});

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

  if (!Number.isNaN(+timeDeltaInDays)) {
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
const recentData = () => ({
  startDateTime: Date.now() - msPerDay,
  endDateTime: null,
  dateRange: findDateRangeByValue('Recent'),
});

export default createReducer(initialState(), {
  [DATEPICKER_DROPDOWN_FILTER]: (state, action) => {
    const { data } = action;

    switch (data.dateRange.label) {
      case 'Custom':
      case 'All':
        Object.assign(state, data, {
          startDateTime: null,
          endDateTime: null,
        });
        break;
      case 'Recent':
        Object.assign(state, data, recentData());
        break;
      default:
        Object.assign(
          state,
          computeDateTimeDelta(data.dateRange.value),
          data
        );
        break;
    }
  },
  [DATEPICKER_DATECHANGE]: (state, action) => {
    Object.assign(state, action.data);
  },
  [DATEPICKER_HOUR_FORMAT]: (state, action) => {
    state.hourFormat = action.data;
  },
});
