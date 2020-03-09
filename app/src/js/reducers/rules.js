'use strict';
import { set, del } from 'object-path';
import assignDate from './assign-date';
import removeDeleted from './remove-deleted';
import cloneDeep from 'lodash.clonedeep';

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
  RULE_DISABLE_ERROR
} from '../actions/types';

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

export default function reducer (state = initialState, action) {
  let newState = null;
  const { data, id } = action;
  switch (action.type) {
    case RULE:
      newState = cloneDeep(state);
      set(newState, ['map', id, 'inflight'], false);
      set(newState, ['map', id, 'data'], data);
      del(newState, ['deleted', id]);
      break;
    case RULE_INFLIGHT:
      newState = cloneDeep(state);
      set(newState, ['map', id, 'inflight'], true);
      break;
    case RULE_ERROR:
      newState = cloneDeep(state);
      set(newState, ['map', id, 'inflight'], false);
      set(newState, ['map', id, 'error'], action.error);
      break;

    case RULES:
      newState = cloneDeep(state);
      set(newState, ['list', 'data'], removeDeleted('name', data.results, state.deleted));
      set(newState, ['list', 'meta'], assignDate(data.meta));
      set(newState, ['list', 'inflight'], false);
      set(newState, ['list', 'error'], false);
      break;
    case RULES_INFLIGHT:
      newState = cloneDeep(state);
      set(newState, ['list', 'inflight'], true);
      break;
    case RULES_ERROR:
      newState = cloneDeep(state);
      set(newState, ['list', 'inflight'], false);
      set(newState, ['list', 'error'], action.error);
      break;

    case UPDATE_RULE:
      newState = cloneDeep(state);
      set(newState, ['map', id, 'data'], data);
      set(newState, ['updated', id, 'status'], 'success');
      break;
    case UPDATE_RULE_INFLIGHT:
      newState = cloneDeep(state);
      set(newState, ['updated', id, 'status'], 'inflight');
      break;
    case UPDATE_RULE_ERROR:
      newState = cloneDeep(state);
      set(newState, ['updated', id, 'status'], 'error');
      set(newState, ['updated', id, 'error'], action.error);
      break;
    case UPDATE_RULE_CLEAR:
      newState = cloneDeep(state);
      del(newState, ['updated', id]);
      break;

    case NEW_RULE:
      newState = cloneDeep(state);
      set(newState, ['created', id, 'status'], 'success');
      break;
    case NEW_RULE_INFLIGHT:
      newState = cloneDeep(state);
      set(newState, ['created', id, 'status'], 'inflight');
      break;
    case NEW_RULE_ERROR:
      newState = cloneDeep(state);
      set(newState, ['created', id, 'status'], 'error');
      set(newState, ['created', id, 'error'], action.error);
      break;

    case RULE_DELETE:
      newState = cloneDeep(state);
      set(newState, ['deleted', id, 'status'], 'success');
      set(newState, ['deleted', id, 'error'], null);
      break;
    case RULE_DELETE_INFLIGHT:
      newState = cloneDeep(state);
      set(newState, ['deleted', id, 'status'], 'inflight');
      break;
    case RULE_DELETE_ERROR:
      newState = cloneDeep(state);
      set(newState, ['deleted', id, 'status'], 'error');
      set(newState, ['deleted', id, 'error'], action.error);
      break;

    case RULE_RERUN:
      newState = cloneDeep(state);
      set(newState, ['rerun', id, 'status'], 'success');
      set(newState, ['rerun', id, 'error'], null);
      break;
    case RULE_RERUN_INFLIGHT:
      newState = cloneDeep(state);
      set(newState, ['rerun', id, 'status'], 'inflight');
      break;
    case RULE_RERUN_ERROR:
      newState = cloneDeep(state);
      set(newState, ['rerun', id, 'status'], 'error');
      set(newState, ['rerun', id, 'error'], action.error);
      break;

    case RULE_ENABLE:
      newState = cloneDeep(state);
      set(newState, ['enabled', id, 'status'], 'success');
      set(newState, ['enabled', id, 'error'], null);
      del(newState, ['disbled', id]);
      break;
    case RULE_ENABLE_INFLIGHT:
      newState = cloneDeep(state);
      set(newState, ['enabled', id, 'status'], 'inflight');
      break;
    case RULE_ENABLE_ERROR:
      newState = cloneDeep(state);
      set(newState, ['enabled', id, 'status'], 'error');
      set(newState, ['enabled', id, 'error'], action.error);
      break;

    case RULE_DISABLE:
      newState = cloneDeep(state);
      set(newState, ['disabled', id, 'status'], 'success');
      set(newState, ['disabled', id, 'error'], null);
      del(newState, ['enabled', id]);
      break;
    case RULE_DISABLE_INFLIGHT:
      newState = cloneDeep(state);
      set(newState, ['disabled', id, 'status'], 'inflight');
      break;
    case RULE_DISABLE_ERROR:
      newState = cloneDeep(state);
      set(newState, ['disabled', id, 'status'], 'error');
      set(newState, ['disabled', id, 'error'], action.error);
      break;
  }
  return newState || state;
}
