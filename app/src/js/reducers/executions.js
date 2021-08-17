import { createReducer } from '@reduxjs/toolkit';
import assignDate from './utils/assign-date';
import {
  EXECUTIONS,
  EXECUTIONS_INFLIGHT,
  EXECUTIONS_ERROR,
  FILTER_EXECUTIONS,
  CLEAR_EXECUTIONS_FILTER,
  SEARCH_EXECUTIONS,
  CLEAR_EXECUTIONS_SEARCH,
  EXECUTIONS_LIST,
  EXECUTIONS_LIST_INFLIGHT,
  EXECUTIONS_LIST_ERROR,
} from '../actions/types';

export const initialState = {
  list: {
    data: [],
    meta: {},
    params: {},
    inflight: false,
    error: false,
  }
};

export default createReducer(initialState, {
  [EXECUTIONS]: (state, action) => {
    state.list.data = action.data.results;
    state.list.meta = assignDate(action.data.meta);
    state.list.inflight = false;
    state.list.error = false;
  },
  [EXECUTIONS_INFLIGHT]: (state) => {
    state.list.inflight = true;
  },
  [EXECUTIONS_ERROR]: (state, action) => {
    state.list.inflight = false;
    state.list.error = action.error;
  },
  [FILTER_EXECUTIONS]: (state, action) => {
    state.list.params[action.param.key] = action.param.value;
  },
  [CLEAR_EXECUTIONS_FILTER]: (state, action) => {
    state.list.params[action.paramKey] = null;
  },
  [SEARCH_EXECUTIONS]: (state, action) => {
    state.list.infix = action.infix;
  },
  [CLEAR_EXECUTIONS_SEARCH]: (state) => {
    state.list.infix = null;
  },
  [EXECUTIONS_LIST]: (state, action) => {
    state.list.data = action.data.results;
    state.list.meta = assignDate(action.data.meta);
    state.list.inflight = false;
    state.list.error = false;
  },
  [EXECUTIONS_LIST_INFLIGHT]: (state) => {
    state.list.inflight = true;
  },
  [EXECUTIONS_LIST_ERROR]: (state, action) => {
    state.list.inflight = false;
    state.list.error = action.error;
  },
});
