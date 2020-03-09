'use strict';
import { set, del } from 'object-path';
import assignDate from './assign-date';
import cloneDeep from 'lodash.clonedeep';

import {
  PDR,
  PDR_INFLIGHT,
  PDR_ERROR,

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
} from '../actions/types';

export const initialState = {
  list: {
    data: [],
    meta: {},
    params: {}
  },
  map: {},
  search: {},
  deleted: {}
};

export default function reducer (state = initialState, action) {
  let newState = null;
  const { id, data } = action;
  switch (action.type) {
    case PDR:
      newState = cloneDeep(state);
      set(newState, ['map', id, 'inflight'], false);
      set(newState, ['map', id, 'data'], assignDate(data));
      // https://github.com/nasa/cumulus-dashboard/issues/284
      del(newState, ['deleted', id]);
      break;
    case PDR_INFLIGHT:
      newState = cloneDeep(state);
      set(newState, ['map', id, 'inflight'], true);
      break;
    case PDR_ERROR:
      newState = cloneDeep(state);
      set(newState, ['map', id, 'inflight'], false);
      set(newState, ['map', id, 'error'], action.error);
      break;

    case PDRS:
      newState = cloneDeep(state);
      set(newState, ['list', 'data'], data.results);
      set(newState, ['list', 'meta'], assignDate(data.meta));
      set(newState, ['list', 'inflight'], false);
      set(newState, ['list', 'error'], false);
      break;
    case PDRS_INFLIGHT:
      newState = cloneDeep(state);
      set(newState, ['list', 'inflight'], true);
      break;
    case PDRS_ERROR:
      newState = cloneDeep(state);
      set(newState, ['list', 'inflight'], false);
      set(newState, ['list', 'error'], action.error);
      break;

    case SEARCH_PDRS:
      newState = cloneDeep(state);
      set(newState, ['list', 'params', 'prefix'], action.prefix);
      break;
    case CLEAR_PDRS_SEARCH:
      newState = cloneDeep(state);
      set(newState, ['list', 'params', 'prefix'], null);
      break;

    case FILTER_PDRS:
      newState = cloneDeep(state);
      set(newState, ['list', 'params', action.param.key], action.param.value);
      break;
    case CLEAR_PDRS_FILTER:
      newState = cloneDeep(state);
      set(newState, ['list', 'params', action.paramKey], null);
      break;

    case PDR_DELETE:
      newState = cloneDeep(state);
      set(newState, ['deleted', id, 'status'], 'success');
      set(newState, ['deleted', id, 'error'], null);
      break;
    case PDR_DELETE_INFLIGHT:
      newState = cloneDeep(state);
      set(newState, ['deleted', id, 'status'], 'inflight');
      break;
    case PDR_DELETE_ERROR:
      newState = cloneDeep(state);
      set(newState, ['deleted', id, 'status'], 'error');
      set(newState, ['deleted', id, 'error'], action.error);
      break;
  }
  return newState || state;
}
