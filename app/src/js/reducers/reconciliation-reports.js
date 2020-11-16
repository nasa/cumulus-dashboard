import { createReducer } from '@reduxjs/toolkit';
import assignDate from './utils/assign-date';
import {
  createErrorReducer,
  createInflightReducer,
  createSuccessReducer
} from './utils/reducer-creators';

import {
  RECONCILIATION,
  RECONCILIATION_INFLIGHT,
  RECONCILIATION_ERROR,
  RECONCILIATIONS,
  RECONCILIATIONS_INFLIGHT,
  RECONCILIATIONS_ERROR,
  RECONCILIATION_DELETE,
  RECONCILIATION_DELETE_INFLIGHT,
  RECONCILIATION_DELETE_ERROR,
  SEARCH_RECONCILIATIONS,
  CLEAR_RECONCILIATIONS_SEARCH,
  NEW_RECONCILIATION_INFLIGHT,
  NEW_RECONCILIATION,
  FILTER_RECONCILIATIONS,
  CLEAR_RECONCILIATIONS_FILTER,
  SEARCH_RECONCILIATION,
  CLEAR_RECONCILIATION_SEARCH,
  FILTER_RECONCILIATION,
  CLEAR_RECONCILIATION_FILTER,
} from '../actions/types';

export const initialState = {
  list: {
    data: [],
    meta: {},
    params: {},
  },
  map: {},
  createReportInflight: false,
  search: {},
  deleted: {},
};

export default createReducer(initialState, {
  [RECONCILIATION]: (state, action) => {
    state.map[action.id] = {
      inflight: false,
      data: assignDate(action.data),
    };
    delete state.deleted[action.id];
  },
  [RECONCILIATION_INFLIGHT]: (state, action) => {
    state.map[action.id] = { inflight: true };
  },
  [RECONCILIATION_ERROR]: (state, action) => {
    state.map[action.id] = {
      inflight: false,
      error: action.error,
    };
  },
  [RECONCILIATIONS]: (state, action) => {
    const reports = action.data.results;
    state.list.data = reports;
    state.list.meta = assignDate(action.data.meta);
    state.list.inflight = false;
    state.list.error = false;
  },
  [RECONCILIATIONS_INFLIGHT]: (state) => {
    state.list.inflight = true;
  },
  [RECONCILIATIONS_ERROR]: (state, action) => {
    state.list.inflight = false;
    state.list.error = action.error;
  },
  [RECONCILIATION_DELETE]: createSuccessReducer('deleted'),
  [RECONCILIATION_DELETE_INFLIGHT]: createInflightReducer('deleted'),
  [RECONCILIATION_DELETE_ERROR]: createErrorReducer('deleted'),
  [SEARCH_RECONCILIATIONS]: (state, action) => {
    state.list.params.infix = action.infix;
  },
  [CLEAR_RECONCILIATIONS_SEARCH]: (state) => {
    delete state.list.params.infix;
  },
  [NEW_RECONCILIATION_INFLIGHT]: (state) => {
    state.createReportInflight = true;
  },
  [NEW_RECONCILIATION]: (state) => {
    state.createReportInflight = false;
  },
  [FILTER_RECONCILIATIONS]: (state, action) => {
    state.list.params[action.param.key] = action.param.value;
  },
  [CLEAR_RECONCILIATIONS_FILTER]: (state, action) => {
    state.list.params[action.paramKey] = null;
  },
  [SEARCH_RECONCILIATION]: (state, action) => {
    state.searchString = action.searchString;
  },
  [CLEAR_RECONCILIATION_SEARCH]: (state) => {
    state.searchString = null;
  },
  [FILTER_RECONCILIATION]: (state, action) => {
    state.list.params[action.param.key] = action.param.value;
  },
  [CLEAR_RECONCILIATION_FILTER]: (state, action) => {
    state.list.params[action.paramKey] = null;
  }
});
