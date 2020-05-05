'use strict';
import { set, del } from 'object-path';
import assignDate from './assign-date';
import removeDeleted from './remove-deleted';

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
  CLEAR_RULES_FILTER
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
  map: {},
  created: {},
  updated: {},
  deleted: {},
  enabled: {},
  disabled: {}
};

export default createReducer(initialState, {
  [RULE]: (state, action) => {
    const { data, id } = action;
    set(state, ['map', id, 'inflight'], false);
    set(state, ['map', id, 'data'], data);
    del(state, ['deleted', id]);
  },
  [RULE_INFLIGHT]: (state, action) => {
    const { id } = action;
    set(state, ['map', id, 'inflight'], true);
  },
  [RULE_ERROR]: (state, action) => {
    const { id } = action;
    set(state, ['map', id, 'inflight'], false);
    set(state, ['map', id, 'error'], action.error);
  },

  [RULES]: (state, action) => {
    const { data } = action;
    set(state, ['list', 'data'], removeDeleted('name', data.results, state.deleted));
    set(state, ['list', 'meta'], assignDate(data.meta));
    set(state, ['list', 'inflight'], false);
    set(state, ['list', 'error'], false);
  },
  [RULES_INFLIGHT]: (state, action) => {
    set(state, ['list', 'inflight'], true);
  },
  [RULES_ERROR]: (state, action) => {
    set(state, ['list', 'inflight'], false);
    set(state, ['list', 'error'], action.error);
  },

  [UPDATE_RULE]: (state, action) => {
    const { data, id } = action;
    set(state, ['map', id, 'data'], data);
    set(state, ['updated', id, 'status'], 'success');
  },
  [UPDATE_RULE_INFLIGHT]: (state, action) => {
    const { id } = action;
    set(state, ['updated', id, 'status'], 'inflight');
  },
  [UPDATE_RULE_ERROR]: (state, action) => {
    const { id } = action;
    set(state, ['updated', id, 'status'], 'error');
    set(state, ['updated', id, 'error'], action.error);
  },
  [UPDATE_RULE_CLEAR]: (state, action) => {
    const { id } = action;
    del(state, ['updated', id]);
  },

  [NEW_RULE]: (state, action) => {
    const { id } = action;
    set(state, ['created', id, 'status'], 'success');
  },
  [NEW_RULE_INFLIGHT]: (state, action) => {
    const { id } = action;
    set(state, ['created', id, 'status'], 'inflight');
  },
  [NEW_RULE_ERROR]: (state, action) => {
    const { id } = action;
    set(state, ['created', id, 'status'], 'error');
    set(state, ['created', id, 'error'], action.error);
  },

  [RULE_DELETE]: (state, action) => {
    const { id } = action;
    set(state, ['deleted', id, 'status'], 'success');
    set(state, ['deleted', id, 'error'], null);
  },
  [RULE_DELETE_INFLIGHT]: (state, action) => {
    const { id } = action;
    set(state, ['deleted', id, 'status'], 'inflight');
  },
  [RULE_DELETE_ERROR]: (state, action) => {
    const { id } = action;
    set(state, ['deleted', id, 'status'], 'error');
    set(state, ['deleted', id, 'error'], action.error);
  },

  [RULE_RERUN]: (state, action) => {
    const { id } = action;
    set(state, ['rerun', id, 'status'], 'success');
    set(state, ['rerun', id, 'error'], null);
  },
  [RULE_RERUN_INFLIGHT]: (state, action) => {
    const { id } = action;
    set(state, ['rerun', id, 'status'], 'inflight');
  },
  [RULE_RERUN_ERROR]: (state, action) => {
    const { id } = action;
    set(state, ['rerun', id, 'status'], 'error');
    set(state, ['rerun', id, 'error'], action.error);
  },

  [RULE_ENABLE]: (state, action) => {
    const { id } = action;
    set(state, ['enabled', id, 'status'], 'success');
    set(state, ['enabled', id, 'error'], null);
    del(state, ['disbled', id]);
  },
  [RULE_ENABLE_INFLIGHT]: (state, action) => {
    const { id } = action;
    set(state, ['enabled', id, 'status'], 'inflight');
  },
  [RULE_ENABLE_ERROR]: (state, action) => {
    const { id } = action;
    set(state, ['enabled', id, 'status'], 'error');
    set(state, ['enabled', id, 'error'], action.error);
  },

  [RULE_DISABLE]: (state, action) => {
    const { id } = action;
    set(state, ['disabled', id, 'status'], 'success');
    set(state, ['disabled', id, 'error'], null);
    del(state, ['enabled', id]);
  },
  [RULE_DISABLE_INFLIGHT]: (state, action) => {
    const { id } = action;
    set(state, ['disabled', id, 'status'], 'inflight');
  },
  [RULE_DISABLE_ERROR]: (state, action) => {
    const { id } = action;
    set(state, ['disabled', id, 'status'], 'error');
    set(state, ['disabled', id, 'error'], action.error);
  },

  [SEARCH_RULES]: (state, action) => {
    set(state, ['list', 'params', 'prefix'], action.prefix);
  },
  [CLEAR_RULES_SEARCH]: (state, action) => {
    set(state, ['list', 'params', 'prefix'], null);
  },
  [FILTER_RULES]: (state, action) => {
    set(state, ['list', 'params', action.param.key], action.param.value);
  },
  [CLEAR_RULES_FILTER]: (state, action) => {
    set(state, ['list', 'params', action.paramKey], null);
  }
});
