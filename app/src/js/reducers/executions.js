'use strict';
import { set } from 'object-path';
import assignDate from './assign-date';
import {
  EXECUTIONS,
  EXECUTIONS_INFLIGHT,
  EXECUTIONS_ERROR,

  FILTER_EXECUTIONS,
  CLEAR_EXECUTIONS_FILTER
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
  state = Object.assign({}, state);
  const { data } = action;
  switch (action.type) {
    case EXECUTIONS:
      set(state, ['list', 'data'], data.results);
      set(state, ['list', 'meta'], assignDate(data.meta));
      set(state, ['list', 'inflight'], false);
      set(state, ['list', 'error'], false);
      break;
    case EXECUTIONS_INFLIGHT:
      set(state, ['list', 'inflight'], true);
      break;
    case EXECUTIONS_ERROR:
      set(state, ['list', 'inflight'], false);
      set(state, ['list', 'error'], action.error);
      break;

    case FILTER_EXECUTIONS:
      set(state, ['list', 'params', action.param.key], action.param.value);
      break;
    case CLEAR_EXECUTIONS_FILTER:
      set(state, ['list', 'params', action.paramKey], null);
      break;
  }
  return state;
}
