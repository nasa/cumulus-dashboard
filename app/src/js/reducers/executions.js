'use strict';
import { set } from 'object-path';
import assignDate from './assign-date';
import {
  EXECUTIONS,
  EXECUTIONS_INFLIGHT,
  EXECUTIONS_ERROR,

  FILTER_EXECUTIONS,
  CLEAR_EXECUTIONS_FILTER,

  SEARCH_EXECUTIONS,
  CLEAR_EXECUTIONS_SEARCH
} from '../actions/types';
import { createReducer } from '@reduxjs/toolkit';

export const initialState = {
  list: {
    data: [],
    meta: {},
    params: {},
    inflight: false,
    error: false
  },
  map: {}
};

export default createReducer(initialState, {
  [EXECUTIONS]: (state, action) => {
    set(state, ['list', 'data'], action.data.results);
    set(state, ['list', 'meta'], assignDate(action.data.meta));
    set(state, ['list', 'inflight'], false);
    set(state, ['list', 'error'], false);
  },
  [EXECUTIONS_INFLIGHT]: (state, action) => {
    set(state, ['list', 'inflight'], true);
  },
  [EXECUTIONS_ERROR]: (state, action) => {
    set(state, ['list', 'inflight'], false);
    set(state, ['list', 'error'], action.error);
  },

  [FILTER_EXECUTIONS]: (state, action) => {
    set(state, ['list', 'params', action.param.key], action.param.value);
  },
  [CLEAR_EXECUTIONS_FILTER]: (state, action) => {
    set(state, ['list', 'params', action.paramKey], null);
  },

  [SEARCH_EXECUTIONS]: (state, action) => {
    set(state, ['list', 'prefix'], action.prefix);
  },
  [CLEAR_EXECUTIONS_SEARCH]: (state, action) => {
    set(state, ['list', 'prefix'], null);
  }
});
