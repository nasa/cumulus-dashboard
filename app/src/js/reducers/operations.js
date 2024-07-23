import { createReducer } from '@reduxjs/toolkit';
import assignDate from './utils/assign-date.js';
import {
  OPERATIONS,
  OPERATIONS_INFLIGHT,
  OPERATIONS_ERROR,
  OPERATION,
  OPERATION_INFLIGHT,
  OPERATION_ERROR,
  FILTER_OPERATIONS,
  CLEAR_OPERATIONS_FILTER,
  SEARCH_OPERATIONS,
  CLEAR_OPERATIONS_SEARCH,
} from '../actions/types.js';

export const initialState = {
  list: {
    data: [],
    count: {},
    meta: {},
    params: {},
    internal: {},
    inflight: false,
    error: false,
  },
  map: {},
};

export default createReducer(initialState, (builder) => {
  builder
    .addCase(OPERATIONS, (state, action) => {
      state.list.data = action.data.results;
      state.list.meta = assignDate(action.data.meta);
      state.list.inflight = false;
      state.list.error = false;
    })
    .addCase(OPERATIONS_INFLIGHT, (state) => {
      state.list.inflight = true;
    })
    .addCase(OPERATIONS_ERROR, (state, action) => {
      state.list.inflight = false;
      state.list.error = action.error;
    })
    .addCase(OPERATION, (state, action) => {
      state.list.data = action.data.results;
      state.list.meta = assignDate(action.data.meta);
      state.list.inflight = false;
      state.list.error = false;
    })
    .addCase(OPERATION_INFLIGHT, (state) => {
      state.list.inflight = true;
    })
    .addCase(OPERATION_ERROR, (state, action) => {
      state.list.inflight = false;
      state.list.error = action.error;
    })
    // Filter
    .addCase(FILTER_OPERATIONS, (state, action) => {
      state.list.params[action.param.key] = action.param.value;
    })
    .addCase(CLEAR_OPERATIONS_FILTER, (state, action) => {
      delete state.list.params[action.paramKey];
    })
    // Search
    .addCase(SEARCH_OPERATIONS, (state, action) => {
      state.list.internal.infix = action.infix;
    })
    .addCase(CLEAR_OPERATIONS_SEARCH, (state) => {
      delete state.list.internal.infix;
    });
});
