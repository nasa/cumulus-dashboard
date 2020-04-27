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
  [EXECUTION_LOGS]: (draftState, { data }) => {
    draftState.inflight = false;
    draftState.error = false;
    draftState.details = data.meta;
    draftState.results = data.results;
  },
  [EXECUTION_LOGS_INFLIGHT]: (draftState) => {
    draftState.inflight = true;
  },
  [EXECUTION_LOGS_ERROR]: (draftState, { error }) => {
    draftState.inflight = false;
    draftState.error = error;
  },
});
