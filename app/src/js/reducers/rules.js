import { createReducer } from '@reduxjs/toolkit';
import assignDate from './utils/assign-date.js';
import removeDeleted from './utils/remove-deleted.js';
import {
  createClearItemReducer,
  createErrorReducer,
  createInflightReducer,
  createSerialReducer,
  createSuccessReducer,
} from './utils/reducer-creators.js';
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
} from '../actions/types.js';

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

export default createReducer(initialState, (builder) => {
  builder
    .addCase(RULE, (state, action) => {
      state.map[action.id] = {
        inflight: false,
        data: action.data,
      };
      delete state.deleted[action.id];
    })
    .addCase(RULE_INFLIGHT, (state, action) => {
      state.map[action.id] = { inflight: true };
    })
    .addCase(RULE_ERROR, (state, action) => {
      state.map[action.id] = {
        inflight: false,
        error: action.error,
      };
    })
    .addCase(RULES, (state, action) => {
      state.list.data = removeDeleted(
        'name',
        action.data.results,
        state.deleted
      );
      state.list.meta = assignDate(action.data.meta);
      state.list.inflight = false;
      state.list.error = false;
    })
    .addCase(RULES_INFLIGHT, (state) => {
      state.list.inflight = true;
    })
    .addCase(RULES_ERROR, (state, action) => {
      state.list.inflight = false;
      state.list.error = action.error;
    })
    // Update(d)
    .addCase(UPDATE_RULE, (state, action) => {
      state.map[action.id] = { data: action.data };
      state.updated[action.id] = { status: 'success' };
    })
    .addCase(UPDATE_RULE_INFLIGHT, createInflightReducer('updated'))
    .addCase(UPDATE_RULE_ERROR, createErrorReducer('updated'))
    .addCase(UPDATE_RULE_CLEAR, createClearItemReducer('updated'))
    // Created
    .addCase(NEW_RULE, createSuccessReducer('created'))
    .addCase(NEW_RULE_INFLIGHT, createInflightReducer('created'))
    .addCase(NEW_RULE_ERROR, createErrorReducer('created'))
    // Deleted
    .addCase(RULE_DELETE, createSuccessReducer('deleted'))
    .addCase(RULE_DELETE_INFLIGHT, createInflightReducer('deleted'))
    .addCase(RULE_DELETE_ERROR, createErrorReducer('deleted'))
    // Rerun
    .addCase(RULE_RERUN, createSuccessReducer('rerun'))
    .addCase(RULE_RERUN_INFLIGHT, createInflightReducer('rerun'))
    .addCase(RULE_RERUN_ERROR, createErrorReducer('rerun'))
    // Enabled
    .addCase(
      RULE_ENABLE,
      createSerialReducer(
        createSuccessReducer('enabled'),
        createClearItemReducer('disabled')
      )
    )
    .addCase(RULE_ENABLE_INFLIGHT, createInflightReducer('enabled'))
    .addCase(RULE_ENABLE_ERROR, createErrorReducer('enabled'))
    // Disabled
    .addCase(
      RULE_DISABLE,
      createSerialReducer(
        createSuccessReducer('disabled'),
        createClearItemReducer('enabled')
      )
    )
    .addCase(RULE_DISABLE_INFLIGHT, createInflightReducer('disabled'))
    .addCase(RULE_DISABLE_ERROR, createErrorReducer('disabled'))
    // Search
    .addCase(SEARCH_RULES, (state, action) => {
      state.list.params.infix = action.infix;
    })
    .addCase(CLEAR_RULES_SEARCH, (state) => {
      delete state.list.params.infix;
    })
    // Filter
    .addCase(FILTER_RULES, (state, action) => {
      state.list.params[action.param.key] = action.param.value;
    })
    .addCase(CLEAR_RULES_FILTER, (state, action) => {
      delete state.list.params[action.paramKey];
    });
});
