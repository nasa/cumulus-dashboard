import { createReducer } from '@reduxjs/toolkit';
import assignDate from './utils/assign-date';
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
} from '../actions/types';

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

export default createReducer(initialState, {
  [OPERATIONS]: (state, action) => {
    state.list.data = action.data.results;
    state.list.meta = assignDate(action.data.meta);
    state.list.inflight = false;
    state.list.error = false;
  },
  [OPERATIONS_INFLIGHT]: (state) => {
    state.list.inflight = true;
  },
  [OPERATIONS_ERROR]: (state, action) => {
    state.list.inflight = false;
    state.list.error = action.error;
  },
  [OPERATION]: (state, action) => {
    state.list.data = action.data.results;
    state.list.meta = assignDate(action.data.meta);
    state.list.inflight = false;
    state.list.error = false;
  },
  [OPERATION_INFLIGHT]: (state) => {
    state.list.inflight = true;
  },
  [OPERATION_ERROR]: (state, action) => {
    state.list.inflight = false;
    state.list.error = action.error;
  },
  [FILTER_OPERATIONS]: (state, action) => {
    state.list.params[action.param.key] = action.param.value;
  },
  [CLEAR_OPERATIONS_FILTER]: (state, action) => {
    delete state.list.params[action.paramKey];
  },
  [SEARCH_OPERATIONS]: (state, action) => {
    state.list.internal.infix = action.infix;
  },
  [CLEAR_OPERATIONS_SEARCH]: (state) => {
    delete state.list.internal.infix;
  },
});
