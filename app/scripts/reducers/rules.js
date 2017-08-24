'use strict';
import { set } from 'object-path';
import assignDate from './assign-date';
import {
  RULES,
  RULES_INFLIGHT,
  RULES_ERROR
} from '../actions';

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
    case RULES:
      set(state, ['list', 'data'], data.results);
      set(state, ['list', 'meta'], assignDate(data.meta));
      set(state, ['list', 'inflight'], false);
      set(state, ['list', 'error'], false);
      break;
    case RULES_INFLIGHT:
      set(state, ['list', 'inflight'], true);
      break;
    case RULES_ERROR:
      set(state, ['list', 'inflight'], false);
      set(state, ['list', 'error'], action.error);
      break;
  }
  return state;
}
