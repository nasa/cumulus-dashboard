'use strict';

import {
  DATEPICKER_DATECHANGE,
  DATEPICKER_DROPDOWN_FILTER
} from '../actions/types';

const daysToMilliseconds = 1000 * 60 * 60 * 24;
const initialState = {
  startDateTime: null,
  endDateTime: null,
  dateRange: {value: 'All', label: 'All'}
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

const setStateDate = (data) => {
  console.log('setStateDate', JSON.stringify(data));
};

export default function reducer(state = initialState, action) {
  state = { ...state };
  const { data } = action;
  switch (action.type) {
    case DATEPICKER_DROPDOWN_FILTER:
      // Dropdown was selected by user
      state = {...data, ...computeDateTimeDelta(data.dateRange.value)};
      console.log(`reducer data: ${JSON.stringify(data)}`);
      break;
    case DATEPICKER_DATECHANGE:
      state = { ...state, ...data };
      break;
  }
  return state;
}
