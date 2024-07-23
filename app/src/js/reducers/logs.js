import moment from 'moment';
import uniqBy from 'lodash/fp/uniqBy.js';
import get from 'object-path';
import { createReducer } from '@reduxjs/toolkit';
import { LOGS, LOGS_ERROR, LOGS_INFLIGHT, CLEAR_LOGS } from '../actions/types.js';
import { metricsNotConfiguredMessage } from '../utils/log.js';

// https://momentjs.com/docs/#/displaying/
const format = 'MM/DD/YY hh:mma ss:SSS[s]';

const processLog = (logEntry) => ({
  ...logEntry,
  displayTime: moment(logEntry.timestamp).format(format),
  displayText: logEntry.inner_message || logEntry.message || logEntry.Message,
  key: `${logEntry.timestamp}-${logEntry.displayText}`,
  searchKey: Object.values(logEntry).join(' '),
});

export const initialState = {
  items: [],
  inflight: false,
  error: false,
};

export default createReducer(initialState, (builder) => {
  builder
    .addCase(LOGS, (state, action) => {
      const { data } = action;

      if (Array.isArray(data.results) && data.results.length) {
        state.items = uniqBy((item) => item.key)(data.results
          .map(processLog)
          .filter((result) => result.timestamp && result.displayText));
      }

      state.inflight = false;
      state.queriedAt = Date.now();
      state.error = false;
    })
    .addCase(LOGS_INFLIGHT, (state, action) => {
      const query = get(action.config, 'params.q', '');

      if (state.query !== query) {
        state.query = query;
        state.items = [];
      }

      state.inflight = true;
    })
    .addCase(LOGS_ERROR, (state, action) => {
      state.inflight = false;
      state.error = action.error;
      if (action.error === metricsNotConfiguredMessage) {
        state.metricsNotConfigured = true;
      }
    })
    .addCase(CLEAR_LOGS, (state, action) => {
      state.inflight = false;
      state.error = action.error;
      state.items = [];
    });
});
