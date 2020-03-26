'use strict';
import { set } from 'object-path';

import {
  EXECUTION_LOGS,
  EXECUTION_LOGS_INFLIGHT,
  EXECUTION_LOGS_ERROR
} from '../actions/types';
import { createReducer } from '@reduxjs/toolkit';

export const initialState = {
  results: null,
  details: null,
  inflight: false,
  error: false,
  meta: {}
};

export default createReducer(initialState, {

  [EXECUTION_LOGS]: (state, action) => {
    const { data } = action;
    set(state, ['inflight'], false);
    set(state, ['error'], false);
    set(state, ['details'], data.meta);
    set(state, ['results'], data.results);
  },
  [EXECUTION_LOGS_INFLIGHT]: (state, action) => {
    set(state, ['inflight'], true);
  },
  [EXECUTION_LOGS_ERROR]: (state, action) => {
    set(state, ['inflight'], false);
    set(state, ['error'], action.error);
  }
});
