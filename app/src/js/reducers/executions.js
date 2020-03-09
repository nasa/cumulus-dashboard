'use strict';
import { set } from 'object-path';
import assignDate from './assign-date';
import cloneDeep from 'lodash.clonedeep';
import {
  EXECUTIONS,
  EXECUTIONS_INFLIGHT,
  EXECUTIONS_ERROR,

  FILTER_EXECUTIONS,
  CLEAR_EXECUTIONS_FILTER,

  SEARCH_EXECUTIONS,
  CLEAR_EXECUTIONS_SEARCH
} from '../actions/types';

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

export default function reducer (state = initialState, action) {
  let newState = null;
  const { data } = action;
  switch (action.type) {
    case EXECUTIONS:
      newState = cloneDeep(state);
      set(newState, ['list', 'data'], data.results);
      set(newState, ['list', 'meta'], assignDate(data.meta));
      set(newState, ['list', 'inflight'], false);
      set(newState, ['list', 'error'], false);
      break;
    case EXECUTIONS_INFLIGHT:
      newState = cloneDeep(state);
      set(newState, ['list', 'inflight'], true);
      break;
    case EXECUTIONS_ERROR:
      newState = cloneDeep(state);
      set(newState, ['list', 'inflight'], false);
      set(newState, ['list', 'error'], action.error);
      break;

    case FILTER_EXECUTIONS:
      newState = cloneDeep(state);
      set(newState, ['list', 'params', action.param.key], action.param.value);
      break;
    case CLEAR_EXECUTIONS_FILTER:
      newState = cloneDeep(state);
      set(newState, ['list', 'params', action.paramKey], null);
      break;

    case SEARCH_EXECUTIONS:
      newState = cloneDeep(state);
      set(newState, ['list', 'prefix'], action.prefix);
      break;
    case CLEAR_EXECUTIONS_SEARCH:
      newState = cloneDeep(state);
      set(newState, ['list', 'prefix'], null);
      break;
  }
  return newState || state;
}
