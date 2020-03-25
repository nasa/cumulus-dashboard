'use strict';
import { set } from 'object-path';
import assignDate from './assign-date';
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
  CLEAR_OPERATIONS_SEARCH
} from '../actions/types';
import { createReducer } from '@reduxjs/toolkit';

export const initialState = {
  list: {
    data: [],
    count: {},
    meta: {},
    params: {},
    internal: {},
    inflight: false,
    error: false
  },
  map: {}
};

export default createReducer(initialState, {
  [OPERATIONS]: (state, action) => {
    const { data } = action;
    set(state, ['list', 'data'], data.results);
    set(state, ['list', 'meta'], assignDate(data.meta));
    set(state, ['list', 'inflight'], false);
    set(state, ['list', 'error'], false);
  },
  [OPERATIONS_INFLIGHT]: (state, action) => {
    set(state, ['list', 'inflight'], true);
  },
  [OPERATIONS_ERROR]: (state, action) => {
    set(state, ['list', 'inflight'], false);
    set(state, ['list', 'error'], action.error);
  },

  [OPERATION]: (state, action) => {
    const { data } = action;
    set(state, ['list', 'data'], data.results);
    set(state, ['list', 'meta'], assignDate(data.meta));
    set(state, ['list', 'inflight'], false);
    set(state, ['list', 'error'], false);
  },
  [OPERATION_INFLIGHT]: (state, action) => {
    set(state, ['list', 'inflight'], true);
  },
  [OPERATION_ERROR]: (state, action) => {
    set(state, ['list', 'inflight'], false);
    set(state, ['list', 'error'], action.error);
  },

  [FILTER_OPERATIONS]: (state, action) => {
    set(state, ['list', 'params', action.param.key], action.param.value);
  },
  [CLEAR_OPERATIONS_FILTER]: (state, action) => {
    set(state, ['list', 'params', action.paramKey], null);
  },

  [SEARCH_OPERATIONS]: (state, action) => {
    set(state, ['list', 'internal', 'prefix'], action.prefix);
  },
  [CLEAR_OPERATIONS_SEARCH]: (state, action) => {
    set(state, ['list', 'internal', 'prefix'], null);
  }
});
