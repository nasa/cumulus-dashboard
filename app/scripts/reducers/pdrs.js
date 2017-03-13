'use strict';
import { set } from 'object-path';
import assignDate from './assign-date';

import {
  PDRS,
  PDRS_INFLIGHT,
  PDRS_ERROR,

  SEARCH_PDRS,
  SEARCH_PDRS_INFLIGHT,
  SEARCH_PDRS_ERROR,
  CLEAR_PDRS_SEARCH
} from '../actions';

export const initialState = {
  list: {
    data: [],
    meta: {},
    prefix: null
  },
  search: {}
};

export default function reducer (state = initialState, action) {
  state = Object.assign({}, state);
  const { data, config } = action;
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
      set(state, ['list', 'data'], assignDate(data.results));
      set(state, ['search', 'inflight'], false);
      break;
    case SEARCH_PDRS_INFLIGHT:
      set(state, ['list', 'prefix'], config.qs.prefix);
      set(state, ['search', 'inflight'], true);
      break;
    case SEARCH_PDRS_ERROR:
      set(state, ['search', 'error'], action.error);
      set(state, ['search', 'inflight'], false);
      break;
    case CLEAR_PDRS_SEARCH:
      set(state, ['list', 'prefix'], null);
      set(state, ['search', 'error'], null);
      set(state, ['search', 'inflight'], false);
      break;
  }
  return state;
}
