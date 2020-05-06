'use strict';

import { createReducer } from '@reduxjs/toolkit';
import {
  EXECUTION_LOGS,
  EXECUTION_LOGS_INFLIGHT,
  EXECUTION_LOGS_ERROR,
} from '../actions/types';

export const initialState = {
  results: null,
  details: null,
  inflight: false,
  error: false,
  meta: {},
};

export default createReducer(initialState, {
  [EXECUTION_LOGS]: (state, action) => {
    state.inflight = false;
    state.error = false;
    state.details = action.data.meta;
    state.results = action.data.results;
  },
  [EXECUTION_LOGS_INFLIGHT]: (state) => {
    state.inflight = true;
  },
  [EXECUTION_LOGS_ERROR]: (state, action) => {
    state.inflight = false;
    state.error = action.error;
  },
});
