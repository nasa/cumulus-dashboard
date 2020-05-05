'use strict';
import { set } from 'object-path';

import {
  EXECUTION_STATUS,
  EXECUTION_STATUS_INFLIGHT,
  EXECUTION_STATUS_ERROR,
  SEARCH_EXECUTION_EVENTS,
  CLEAR_EXECUTION_EVENTS_SEARCH
} from '../actions/types';
import { createReducer } from '@reduxjs/toolkit';

export const initialState = {
  execution: null,
  executionHistory: null,
  stateMachine: null,
  searchString: null,
  inflight: false,
  error: false,
  meta: {}
};

/**
 * Filters intput data by searchString on the data'a object's type.
*
 * @param {Array} rawData - An array of objects with a type parameter.
 * @param {string} searchString - a string to check if type includes.
 * @returns {Array} Filtered Array of rawData's objects who's type include searchString.
 */
export const filterData = (rawData, searchString) => {
  if (searchString !== null) {
    const data = {
      execution: rawData.execution,
      stateMachine: rawData.stateMachine,
      executionHistory: rawData.executionHistory
    };
    const filteredEvents = rawData.executionHistory.events.filter(d => d.type.toLowerCase().includes(searchString.toLowerCase()));
    data.executionHistory.events = filteredEvents;
    return data;
  }
  return rawData;
};

export default createReducer(initialState, {
  [EXECUTION_STATUS]: (state, action) => {
    const { data: rawData } = action;
    const data = filterData(rawData, state.searchString);
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
  [SEARCH_EXECUTION_EVENTS]: (state, action) => {
    set(state, ['searchString'], action.searchString);
  },
  [CLEAR_EXECUTION_EVENTS_SEARCH]: (state) => {
    set(state, ['searchString'], null);
  },
});
