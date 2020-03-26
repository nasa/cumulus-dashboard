'use strict';
import { set, del } from 'object-path';
import assignDate from './assign-date';

import {
  RECONCILIATION,
  RECONCILIATION_INFLIGHT,
  RECONCILIATION_ERROR,

  RECONCILIATIONS,
  RECONCILIATIONS_INFLIGHT,
  RECONCILIATIONS_ERROR,

  SEARCH_RECONCILIATIONS,
  CLEAR_RECONCILIATIONS_SEARCH,

  NEW_RECONCILIATION_INFLIGHT,
  NEW_RECONCILIATION
} from '../actions/types';
import { createReducer } from '@reduxjs/toolkit';

export const initialState = {
  list: {
    data: [],
    meta: {},
    params: {}
  },
  map: {},
  createReportInflight: false,
  search: {},
  deleted: {}
};

export default createReducer(initialState, {
  [RECONCILIATION]: (state, action) => {
    const { id, data } = action;
    set(state, ['map', id, 'inflight'], false);
    set(state, ['map', id, 'data'], assignDate(data));
    del(state, ['deleted', id]);
  },
  [RECONCILIATION_INFLIGHT]: (state, action) => {
    const { id } = action;
    set(state, ['map', id, 'inflight'], true);
  },
  [RECONCILIATION_ERROR]: (state, action) => {
    const { id } = action;
    set(state, ['map', id, 'inflight'], false);
    set(state, ['map', id, 'error'], action.error);
  },

  [RECONCILIATIONS]: (state, action) => {
    const { data } = action;
    // response.results is a array of string filenames
    const results = data.results.map((filename) => ({ reconciliationReportName: filename }));
    set(state, ['list', 'data'], results);
    set(state, ['list', 'meta'], assignDate(data.meta));
    set(state, ['list', 'inflight'], false);
    set(state, ['list', 'error'], false);
  },
  [RECONCILIATIONS_INFLIGHT]: (state, action) => {
    set(state, ['list', 'inflight'], true);
  },
  [RECONCILIATIONS_ERROR]: (state, action) => {
    set(state, ['list', 'inflight'], false);
    set(state, ['list', 'error'], action.error);
  },

  [SEARCH_RECONCILIATIONS]: (state, action) => {
    set(state, ['list', 'params', 'prefix'], action.prefix);
  },
  [CLEAR_RECONCILIATIONS_SEARCH]: (state, action) => {
    set(state, ['list', 'params', 'prefix'], null);
  },

  [NEW_RECONCILIATION_INFLIGHT]: (state, action) => {
    set(state, 'createReportInflight', true);
  },

  [NEW_RECONCILIATION]: (state, action) => {
    set(state, 'createReportInflight', false);
  }
});
