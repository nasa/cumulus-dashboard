'use strict';

import cloneDeep from 'lodash.clonedeep';

import {
  DATEPICKER_DATECHANGE,
  DATEPICKER_DROPDOWN_FILTER,
  DATEPICKER_HOUR_FORMAT
} from '../actions/types';

const daysToMilliseconds = 1000 * 60 * 60 * 24;

// Also becomes default props for Datepicker
export const initialState = {
  startDateTime: null,
  endDateTime: null,
  dateRange: {value: 'All', label: 'All'},
  hourFormat: '12HR'
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

export default function reducer (state = initialState, action) {
  let newState = null;
  const { data } = action;
  switch (action.type) {
    case DATEPICKER_DROPDOWN_FILTER:
      newState = cloneDeep(state);
      newState = {...newState, ...computeDateTimeDelta(data.dateRange.value), ...data};
      break;
    case DATEPICKER_DATECHANGE:
      newState = cloneDeep(state);
      newState = { ...newState, ...data };
      break;
    case DATEPICKER_HOUR_FORMAT:
      newState = cloneDeep(state);
      newState = { ...newState, ...{hourFormat: data} };
  }
  return newState || state;
}
