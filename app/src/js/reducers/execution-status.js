'use strict';

import { createReducer } from '@reduxjs/toolkit';
import {
  EXECUTION_STATUS,
  EXECUTION_STATUS_INFLIGHT,
  EXECUTION_STATUS_ERROR,
  SEARCH_EXECUTION_EVENTS,
  CLEAR_EXECUTION_EVENTS_SEARCH,
} from '../actions/types';

export const initialState = {
  execution: null,
  executionHistory: null,
  stateMachine: null,
  searchString: null,
  inflight: false,
  error: false,
  meta: {},
};

const typeContains = (string) => ({ type }) =>
  type.toLowerCase().includes(string.toLowerCase());

export default createReducer(initialState, {
  [EXECUTION_STATUS]: (draftState, { data }) => {
    draftState.inflight = false;
    draftState.error = false;
    draftState.execution = data.execution;
    draftState.executionHistory = data.executionHistory;
    draftState.stateMachine = data.stateMachine;

    if (draftState.searchString) {
      draftState.executionHistory.events = data.executionHistory.events.filter(
        typeContains(draftState.searchString)
      );
    }
  },
  [EXECUTION_STATUS_INFLIGHT]: (draftState) => {
    draftState.inflight = true;
  },
  [EXECUTION_STATUS_ERROR]: (draftState, { error }) => {
    draftState.inflight = false;
    draftState.error = error;
  },
  [SEARCH_EXECUTION_EVENTS]: (draftState, { searchString }) => {
    draftState.searchString = searchString;
  },
  [CLEAR_EXECUTION_EVENTS_SEARCH]: (draftState) => {
    draftState.searchString = null;
  },
});
