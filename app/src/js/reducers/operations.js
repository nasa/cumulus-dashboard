'use strict';
import { set } from 'object-path';
import assignDate from './assign-date';
import cloneDeep from 'lodash.clonedeep';
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

export default function reducer (state = initialState, action) {
  let newState = null;
  const { data } = action;
  switch (action.type) {
    case OPERATIONS:
      newState = cloneDeep(state);
      set(newState, ['list', 'data'], data.results);
      set(newState, ['list', 'meta'], assignDate(data.meta));
      set(newState, ['list', 'inflight'], false);
      set(newState, ['list', 'error'], false);
      break;
    case OPERATIONS_INFLIGHT:
      newState = cloneDeep(state);
      set(newState, ['list', 'inflight'], true);
      break;
    case OPERATIONS_ERROR:
      newState = cloneDeep(state);
      set(newState, ['list', 'inflight'], false);
      set(newState, ['list', 'error'], action.error);
      break;

    case OPERATION:
      newState = cloneDeep(state);
      set(newState, ['list', 'data'], data.results);
      set(newState, ['list', 'meta'], assignDate(data.meta));
      set(newState, ['list', 'inflight'], false);
      set(newState, ['list', 'error'], false);
      break;
    case OPERATION_INFLIGHT:
      newState = cloneDeep(state);
      set(newState, ['list', 'inflight'], true);
      break;
    case OPERATION_ERROR:
      newState = cloneDeep(state);
      set(newState, ['list', 'inflight'], false);
      set(newState, ['list', 'error'], action.error);
      break;

    case FILTER_OPERATIONS:
      newState = cloneDeep(state);
      set(newState, ['list', 'params', action.param.key], action.param.value);
      break;
    case CLEAR_OPERATIONS_FILTER:
      newState = cloneDeep(state);
      set(newState, ['list', 'params', action.paramKey], null);
      break;

    case SEARCH_OPERATIONS:
      newState = cloneDeep(state);
      set(newState, ['list', 'internal', 'prefix'], action.prefix);
      break;
    case CLEAR_OPERATIONS_SEARCH:
      newState = cloneDeep(state);
      set(newState, ['list', 'internal', 'prefix'], null);
      break;
  }
  return newState || state;
}
