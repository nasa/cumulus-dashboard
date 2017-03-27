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
  CLEAR_PDRS_FILTER,

  PDR_DELETE,
  PDR_DELETE_INFLIGHT,
  PDR_DELETE_ERROR
} from '../actions';

export const initialState = {
  list: {
    data: [],
    meta: {},
    params: {}
  },
  search: {},
  deleted: {}
};

export default function reducer (state = initialState, action) {
  state = Object.assign({}, state);
  const { id, data } = action;
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

    case PDR_DELETE:
      set(state, ['deleted', id, 'status'], 'success');
      set(state, ['deleted', id, 'error'], null);
      break;
    case PDR_DELETE_INFLIGHT:
      set(state, ['deleted', id, 'status'], 'inflight');
      break;
    case PDR_DELETE_ERROR:
      set(state, ['deleted', id, 'status'], 'error');
      set(state, ['deleted', id, 'error'], action.error);
      break;
  }
  return state;
}
