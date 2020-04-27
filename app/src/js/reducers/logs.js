'use strict';

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
  [LOGS]: (draftState, { data }) => {
    if (Array.isArray(data.results) && data.results.length) {
      draftState.items = uniqBy(
        'key',
        data.results
          .filter((result) => result.timestamp && result.displayText)
          .map(processLog)
          .concat(draftState.items)
      );
    }

    draftState.inflight = false;
    draftState.queriedAt = Date.now();
    draftState.error = false;
  },
  [LOGS_INFLIGHT]: (draftState, { config }) => {
    const query = get(config, 'qs.q', '');

    if (draftState.query !== query) {
      draftState.query = query;
      draftState.items = [];
    }

    draftState.inflight = true;
  },
  [LOGS_ERROR]: (draftState, { error }) => {
    draftState.inflight = false;
    draftState.error = error;
  },
  [CLEAR_LOGS]: (draftState, { error }) => {
    draftState.inflight = false;
    draftState.error = error;
    draftState.items = [];
  },
});
