'use strict';

import { createReducer } from '@reduxjs/toolkit';
import assignDate from './utils/assign-date';
import removeDeleted from './utils/remove-deleted';
import {
  createClearItemReducer,
  createErrorReducer,
  createInflightReducer,
  createSerialReducer,
  createSuccessReducer,
} from './utils/reducer-creators';
import {
  RULES,
  RULES_INFLIGHT,
  RULES_ERROR,
  RULE,
  RULE_INFLIGHT,
  RULE_ERROR,
  UPDATE_RULE,
  UPDATE_RULE_INFLIGHT,
  UPDATE_RULE_ERROR,
  UPDATE_RULE_CLEAR,
  NEW_RULE,
  NEW_RULE_INFLIGHT,
  NEW_RULE_ERROR,
  RULE_DELETE,
  RULE_DELETE_INFLIGHT,
  RULE_DELETE_ERROR,
  RULE_RERUN,
  RULE_RERUN_INFLIGHT,
  RULE_RERUN_ERROR,
  RULE_ENABLE,
  RULE_ENABLE_INFLIGHT,
  RULE_ENABLE_ERROR,
  RULE_DISABLE,
  RULE_DISABLE_INFLIGHT,
  RULE_DISABLE_ERROR,
  SEARCH_RULES,
  CLEAR_RULES_SEARCH,
  FILTER_RULES,
  CLEAR_RULES_FILTER,
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
  created: {},
  updated: {},
  deleted: {},
  enabled: {},
  disabled: {},
};

export default createReducer(initialState, {
  [RULE]: ({ map, deleted }, { id, data }) => {
    map[id] = { data };
    delete deleted[id];
  },
  [RULE_INFLIGHT]: ({ map }, { id }) => {
    map[id] = { inflight: true };
  },
  [RULE_ERROR]: ({ map }, { id, error }) => {
    map[id] = { error };
  },
  [RULES]: ({ list, deleted }, { data }) => {
    list.data = removeDeleted('name', data.results, deleted);
    list.meta = assignDate(data.meta);
    list.inflight = false;
    list.error = false;
  },
  [RULES_INFLIGHT]: ({ list }) => {
    list.inflight = true;
  },
  [RULES_ERROR]: ({ list }, { error }) => {
    list.inflight = false;
    list.error = error;
  },
  [UPDATE_RULE]: ({ map, updated }, { id, data }) => {
    map[id] = { data };
    updated[id] = { status: 'success' };
  },
  [UPDATE_RULE_INFLIGHT]: createInflightReducer('updated'),
  [UPDATE_RULE_ERROR]: createErrorReducer('updated'),
  [UPDATE_RULE_CLEAR]: createClearItemReducer('updated'),
  [NEW_RULE]: createSuccessReducer('created'),
  [NEW_RULE_INFLIGHT]: createInflightReducer('created'),
  [NEW_RULE_ERROR]: createErrorReducer('created'),
  [RULE_DELETE]: createSuccessReducer('deleted'),
  [RULE_DELETE_INFLIGHT]: createInflightReducer('deleted'),
  [RULE_DELETE_ERROR]: createErrorReducer('deleted'),
  [RULE_RERUN]: createSuccessReducer('rerun'),
  [RULE_RERUN_INFLIGHT]: createInflightReducer('rerun'),
  [RULE_RERUN_ERROR]: createErrorReducer('rerun'),
  [RULE_ENABLE]: createSerialReducer(
    createSuccessReducer('enabled'),
    createClearItemReducer('disabled')
  ),
  [RULE_ENABLE_INFLIGHT]: createInflightReducer('enabled'),
  [RULE_ENABLE_ERROR]: createErrorReducer('enabled'),
  [RULE_DISABLE]: createSerialReducer(
    createSuccessReducer('disabled'),
    createClearItemReducer('enabled')
  ),
  [RULE_DISABLE_INFLIGHT]: createInflightReducer('disabled'),
  [RULE_DISABLE_ERROR]: createErrorReducer('disabled'),
  [SEARCH_RULES]: ({ list }, { prefix }) => {
    list.params.prefix = prefix;
  },
  [CLEAR_RULES_SEARCH]: ({ list }) => {
    delete list.params.prefix;
  },
  [FILTER_RULES]: ({ list }, { param }) => {
    list.params[param.key] = param.value;
  },
  [CLEAR_RULES_FILTER]: ({ list }, { paramKey }) => {
    delete list.params[paramKey];
  },
});
