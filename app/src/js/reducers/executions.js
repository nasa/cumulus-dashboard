'use strict';

import assignDate from './utils/assign-date';
import { createReducer } from '@reduxjs/toolkit';
import {
  EXECUTIONS,
  EXECUTIONS_INFLIGHT,
  EXECUTIONS_ERROR,
  FILTER_EXECUTIONS,
  CLEAR_EXECUTIONS_FILTER,
  SEARCH_EXECUTIONS,
  CLEAR_EXECUTIONS_SEARCH,
} from '../actions/types';

export const initialState = {
  list: {
    data: [],
    meta: {},
    params: {},
    inflight: false,
    error: false,
  },
  map: {},
};

export default createReducer(initialState, {
  [EXECUTIONS]: ({ list }, { data }) => {
    list.data = data.results;
    list.meta = assignDate(data.meta);
    list.inflight = false;
    list.error = false;
  },
  [EXECUTIONS_INFLIGHT]: ({ list }) => {
    list.inflight = true;
  },
  [EXECUTIONS_ERROR]: ({ list }, { error }) => {
    list.inflight = false;
    list.error = error;
  },
  [FILTER_EXECUTIONS]: ({ list }, { param }) => {
    list.params[param.key] = param.value;
  },
  [CLEAR_EXECUTIONS_FILTER]: ({ list }, { paramKey }) => {
    list.params[paramKey] = null;
  },
  [SEARCH_EXECUTIONS]: ({ list }, { prefix }) => {
    list.prefix = prefix;
  },
  [CLEAR_EXECUTIONS_SEARCH]: ({ list }) => {
    list.prefix = null;
  },
});
