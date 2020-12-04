import moment from 'moment';
import uniqBy from 'lodash/fp';
import { get } from 'object-path';
import { createReducer } from '@reduxjs/toolkit';
import { LOGS, LOGS_ERROR, LOGS_INFLIGHT, CLEAR_LOGS } from '../actions/types';

// https://momentjs.com/docs/#/displaying/
const format = 'MM/DD/YY hh:mma ss:SSS[s]';

const processLog = (logEntry) => ({
  ...logEntry,
  displayTime: moment(logEntry.timestamp).format(format),
  displayText: logEntry.message || logEntry.msg,
  key: `${logEntry.timestamp}-${logEntry.displayText}`,
  searchKey: Object.values(logEntry).join(' '),
});

export const initialState = {
  items: [],
};

export default createReducer(initialState, {
  [LOGS]: (state, action) => {
    const { data } = action;

    if (Array.isArray(data.results) && data.results.length) {
      state.items = uniqBy(
        'key',
        data.results
          .filter((result) => result.timestamp && result.displayText)
          .map(processLog)
          .concat(state.items)
      );
    }

    state.inflight = false;
    state.queriedAt = Date.now();
    state.error = false;
  },
  [LOGS_INFLIGHT]: (state, action) => {
    const query = get(action.config, 'params.q', '');

    if (state.query !== query) {
      state.query = query;
      state.items = [];
    }

    state.inflight = true;
  },
  [LOGS_ERROR]: (state, action) => {
    state.inflight = false;
    state.error = action.error;
  },
  [CLEAR_LOGS]: (state, action) => {
    state.inflight = false;
    state.error = action.error;
    state.items = [];
  },
});
