import pick from 'lodash/pick';
import { createReducer } from '@reduxjs/toolkit';
import {
  EXECUTION_LOGS,
  EXECUTION_LOGS_INFLIGHT,
  EXECUTION_LOGS_ERROR,
} from '../actions/types';

const fields = ['stackName', 'version', 'executions', 'level', 'version', 'app_message', 'timestamp', 'sender', 'granules', 'logGroup'];
const processLog = (logEntry) => pick(logEntry, fields);

export const initialState = {
  results: null,
  details: null,
  inflight: false,
  error: false,
  meta: {},
};

export default createReducer(initialState, {
  [EXECUTION_LOGS]: (state, action) => {
    const { data } = action;

    if (Array.isArray(data.results) && data.results.length) {
      state.results = data.results.map(processLog);
    }

    state.details = data.meta;
    state.inflight = false;
    state.error = false;
  },
  [EXECUTION_LOGS_INFLIGHT]: (state) => {
    state.inflight = true;
  },
  [EXECUTION_LOGS_ERROR]: (state, action) => {
    state.inflight = false;
    state.error = action.error;
  },
});
