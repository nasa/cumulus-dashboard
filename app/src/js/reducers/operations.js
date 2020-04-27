'use strict';

import assignDate from './utils/assign-date';
import { createReducer } from '@reduxjs/toolkit';
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
  [OPERATIONS]: ({ list }, { data }) => {
    list.data = data.results;
    list.meta = assignDate(data.meta);
    list.inflight = false;
    list.error = false;
  },
  [OPERATIONS_INFLIGHT]: ({ list }) => {
    list.inflight = true;
  },
  [OPERATIONS_ERROR]: ({ list }, { error }) => {
    list.inflight = false;
    list.error = error;
  },
  [OPERATION]: ({ list }, { data }) => {
    list.data = data.results;
    list.meta = assignDate(data.meta);
    list.inflight = false;
    list.error = false;
  },
  [OPERATION_INFLIGHT]: ({ list }) => {
    list.inflight = true;
  },
  [OPERATION_ERROR]: ({ list }, { error }) => {
    list.inflight = false;
    list.error = error;
  },
  [FILTER_OPERATIONS]: ({ list }, { param }) => {
    list.params[param.key] = param.value;
  },
  [CLEAR_OPERATIONS_FILTER]: ({ list }, { paramKey }) => {
    delete list.params[paramKey];
  },
  [SEARCH_OPERATIONS]: ({ list }, { prefix }) => {
    list.internal.prefix = prefix;
  },
  [CLEAR_OPERATIONS_SEARCH]: ({ list }) => {
    delete list.internal.prefix;
  },
});
