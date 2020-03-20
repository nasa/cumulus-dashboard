'use strict';
import { set } from 'object-path';

import {
  EXECUTION_STATUS,
  EXECUTION_STATUS_INFLIGHT,
  EXECUTION_STATUS_ERROR
} from '../actions/types';
import { createReducer } from '@reduxjs/toolkit';

export const initialState = {
  execution: null,
  executionHistory: null,
  stateMachine: null,
  inflight: false,
  error: false,
  meta: {}
};

export default createReducer(initialState, {
  [EXECUTION_STATUS]: (state, action) => {
    const { data } = action;
    set(state, ['inflight'], false);
    set(state, ['error'], false);
    set(state, ['execution'], data.execution);
    set(state, ['executionHistory'], data.executionHistory);
    set(state, ['stateMachine'], data.stateMachine);
  },
  [EXECUTION_STATUS_INFLIGHT]: (state, action) => {
    set(state, ['inflight'], true);
  },
  [EXECUTION_STATUS_ERROR]: (state, action) => {
    set(state, ['inflight'], false);
    set(state, ['error'], action.error);
  },
});
