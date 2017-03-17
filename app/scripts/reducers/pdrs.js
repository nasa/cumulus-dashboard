'use strict';
import { set } from 'object-path';
import assignDate from './assign-date';

import {
  PDRS,
  PDRS_INFLIGHT,
  PDRS_ERROR,

  SEARCH_PDRS,
  CLEAR_PDRS_SEARCH,

  FILTER_PDRS,
  CLEAR_PDRS_FILTER
} from '../actions';

export const initialState = {
  list: {
    data: [],
    meta: {},
    params: {}
  },
  search: {}
};

export default function reducer (state = initialState, action) {
  state = Object.assign({}, state);
  const { data } = action;
  switch (action.type) {
    case PDRS:
      set(state, ['list', 'data'], data.results);
      set(state, ['list', 'meta'], assignDate(data.meta));
      set(state, ['list', 'inflight'], false);
      break;
    case PDRS_INFLIGHT:
      set(state, ['list', 'inflight'], true);
      break;
    case PDRS_ERROR:
      set(state, ['list', 'inflight'], false);
      set(state, ['list', 'error'], action.error);
      break;

    case SEARCH_PDRS:
      set(state, ['list', 'params', 'prefix'], action.prefix);
      break;
    case CLEAR_PDRS_SEARCH:
      set(state, ['list', 'params', 'prefix'], null);
      break;

    case FILTER_PDRS:
      set(state, ['list', 'params', action.param.key], action.param.value);
      break;
    case CLEAR_PDRS_FILTER:
      set(state, ['list', 'params', action.paramKey], null);
      break;
  }
  return state;
}
