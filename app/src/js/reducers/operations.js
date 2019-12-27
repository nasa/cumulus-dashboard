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

export const initialState = {
  list: {
    data: [],
    count: {},
    params: {},
    inflight: false,
    error: false
  },
  map: {}
};

export default function reducer (state = initialState, action) {
  state = Object.assign({}, state);
  const { data } = action;
  switch (action.type) {
    case OPERATIONS:
      set(state, ['list', 'data'], data.Items);
      set(state, ['list', 'count'], data.Count);
      set(state, ['list', 'inflight'], false);
      set(state, ['list', 'error'], false);
      break;
    case OPERATIONS_INFLIGHT:
      set(state, ['list', 'inflight'], true);
      break;
    case OPERATIONS_ERROR:
      set(state, ['list', 'inflight'], false);
      set(state, ['list', 'error'], action.error);
      break;

    case OPERATION:
      set(state, ['list', 'data'], data.results);
      set(state, ['list', 'meta'], assignDate(data.meta));
      set(state, ['list', 'inflight'], false);
      set(state, ['list', 'error'], false);
      break;
    case OPERATION_INFLIGHT:
      set(state, ['list', 'inflight'], true);
      break;
    case OPERATION_ERROR:
      set(state, ['list', 'inflight'], false);
      set(state, ['list', 'error'], action.error);
      break;

    case FILTER_OPERATIONS:
      set(state, ['list', 'params', action.param.key], action.param.value);
      break;
    case CLEAR_OPERATIONS_FILTER:
      set(state, ['list', 'params', action.paramKey], null);
      break;

    case SEARCH_OPERATIONS:
      set(state, ['list', 'params', 'prefix'], action.prefix);
      break;
    case CLEAR_OPERATIONS_SEARCH:
      set(state, ['list', 'params', 'prefix'], null);
      break;
  }
  return state;
}
