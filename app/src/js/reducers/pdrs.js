'use strict';
import { set, del } from 'object-path';
import assignDate from './assign-date';

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
import { createReducer } from '@reduxjs/toolkit';

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

export default createReducer(initialState, {
  [PDR]: (state, action) => {
    const { id, data } = action;
    set(state, ['map', id, 'inflight'], false);
    set(state, ['map', id, 'data'], assignDate(data));
    // https://github.com/nasa/cumulus-dashboard/issues/284
    del(state, ['deleted', id]);
  },
  [PDR_INFLIGHT]: (state, action) => {
    const { id } = action;
    set(state, ['map', id, 'inflight'], true);
  },
  [PDR_ERROR]: (state, action) => {
    const { id } = action;
    set(state, ['map', id, 'inflight'], false);
    set(state, ['map', id, 'error'], action.error);
  },

  [PDRS]: (state, action) => {
    const { data } = action;
    set(state, ['list', 'data'], data.results);
    set(state, ['list', 'meta'], assignDate(data.meta));
    set(state, ['list', 'inflight'], false);
    set(state, ['list', 'error'], false);
  },
  [PDRS_INFLIGHT]: (state, action) => {
    set(state, ['list', 'inflight'], true);
  },
  [PDRS_ERROR]: (state, action) => {
    set(state, ['list', 'inflight'], false);
    set(state, ['list', 'error'], action.error);
  },

  [SEARCH_PDRS]: (state, action) => {
    set(state, ['list', 'params', 'prefix'], action.prefix);
  },
  [CLEAR_PDRS_SEARCH]: (state, action) => {
    set(state, ['list', 'params', 'prefix'], null);
  },

  [FILTER_PDRS]: (state, action) => {
    set(state, ['list', 'params', action.param.key], action.param.value);
  },
  [CLEAR_PDRS_FILTER]: (state, action) => {
    set(state, ['list', 'params', action.paramKey], null);
  },

  [PDR_DELETE]: (state, action) => {
    const { id } = action;
    set(state, ['deleted', id, 'status'], 'success');
    set(state, ['deleted', id, 'error'], null);
  },
  [PDR_DELETE_INFLIGHT]: (state, action) => {
    const { id } = action;
    set(state, ['deleted', id, 'status'], 'inflight');
  },
  [PDR_DELETE_ERROR]: (state, action) => {
    const { id } = action;
    set(state, ['deleted', id, 'status'], 'error');
    set(state, ['deleted', id, 'error'], action.error);
  }
});
