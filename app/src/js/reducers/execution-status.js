import { createReducer } from '@reduxjs/toolkit';
import get from 'lodash/get.js';
import {
  EXECUTION_STATUS,
  EXECUTION_STATUS_INFLIGHT,
  EXECUTION_STATUS_ERROR,
  SEARCH_EXECUTION_EVENTS,
  CLEAR_EXECUTION_EVENTS_SEARCH,
} from '../actions/types.js';

export const initialState = {
  data: {},
  searchString: null,
  inflight: false,
  error: false,
  meta: {},
  map: {},
};

const typeContains =
  (string) =>
  ({ type }) =>
    type.toLowerCase().includes(string.toLowerCase());

export default createReducer(initialState, (builder) => {
  builder
    .addCase(EXECUTION_STATUS, (state, action) => {
      const { data } = action;
      state.inflight = false;
      state.error = false;
      state.data = data;

      if (
        state.searchString &&
        get(state, 'data.data.executionHistory.events')
      ) {
        state.data.data.executionHistory.events =
          data.data.executionHistory.events.filter(
            typeContains(state.searchString)
          );
      }

      const { map, ...restOfState } = state;

      state.map[action.id] = restOfState;
    })
    .addCase(EXECUTION_STATUS_INFLIGHT, (state, action) => {
      state.inflight = true;
      state.map[action.id] = { inflight: true };
    })
    .addCase(EXECUTION_STATUS_ERROR, (state, action) => {
      state.inflight = false;
      state.error = action.error;
      state.map[action.id] = {
        inflight: false,
        error: action.error,
      };
    })
    .addCase(SEARCH_EXECUTION_EVENTS, (state, action) => {
      state.searchString = action.searchString;
    })
    .addCase(CLEAR_EXECUTION_EVENTS_SEARCH, (state) => {
      state.searchString = null;
    });
});
