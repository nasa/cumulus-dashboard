'use strict';

import { createReducer } from '@reduxjs/toolkit';
import assignDate from './utils/assign-date';
import {
  createErrorReducer,
  createInflightReducer,
  createSuccessReducer,
} from './utils/reducer-creators';
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
  PDR_DELETE_ERROR,
} from '../actions/types';

export const initialState = {
  list: {
    data: [],
    meta: {},
    params: {},
  },
  map: {},
  search: {},
  deleted: {},
};

export default createReducer(initialState, {
  [PDR]: ({ map, deleted }, { id, data }) => {
    map[id] = { data: assignDate(data) };
    // https://github.com/nasa/cumulus-dashboard/issues/284
    delete deleted[id];
  },
  [PDR_INFLIGHT]: ({ map }, { id }) => {
    map[id] = { inflight: true };
  },
  [PDR_ERROR]: ({ map }, { id, error }) => {
    map[id] = { error };
  },
  [PDRS]: ({ list }, { data }) => {
    list.data = data.results;
    list.meta = assignDate(data.meta);
    list.inflight = false;
    list.error = false;
  },
  [PDRS_INFLIGHT]: ({ list }) => {
    list.inflight = true;
  },
  [PDRS_ERROR]: ({ list }, { error }) => {
    list.inflight = false;
    list.error = error;
  },
  [SEARCH_PDRS]: ({ list }, { prefix }) => {
    list.params.prefix = prefix;
  },
  [CLEAR_PDRS_SEARCH]: ({ list }) => {
    delete list.params.prefix;
  },
  [FILTER_PDRS]: ({ list }, { param }) => {
    list.params[param.key] = param.value;
  },
  [CLEAR_PDRS_FILTER]: ({ list }, { paramKey }) => {
    delete list.params[paramKey];
  },
  [PDR_DELETE]: createSuccessReducer('deleted'),
  [PDR_DELETE_INFLIGHT]: createInflightReducer('deleted'),
  [PDR_DELETE_ERROR]: createErrorReducer('deleted'),
});
