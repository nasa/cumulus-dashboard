import { createReducer } from '@reduxjs/toolkit';
import assignDate from './utils/assign-date.js';
import {
  createErrorReducer,
  createInflightReducer,
  createSuccessReducer,
} from './utils/reducer-creators.js';

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
} from '../actions/types.js';

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

export default createReducer(initialState, (builder) => {
  builder
    .addCase(RECONCILIATION, (state, action) => {
      state.map[action.id] = {
        inflight: false,
        data: assignDate(action.data),
      };
      delete state.deleted[action.id];
    })
    .addCase(RECONCILIATION_INFLIGHT, (state, action) => {
      state.map[action.id] = { inflight: true };
    })
    .addCase(RECONCILIATION_ERROR, (state, action) => {
      state.map[action.id] = {
        inflight: false,
        error: action.error,
      };
    })
    .addCase(RECONCILIATIONS, (state, action) => {
      const reports = action.data.results;
      state.list.data = reports;
      state.list.meta = assignDate(action.data.meta);
      state.list.inflight = false;
      state.list.error = false;
    })
    .addCase(RECONCILIATIONS_INFLIGHT, (state) => {
      state.list.inflight = true;
    })
    .addCase(RECONCILIATIONS_ERROR, (state, action) => {
      state.list.inflight = false;
      state.list.error = action.error;
    })
    // Deleted
    .addCase(RECONCILIATION_DELETE, createSuccessReducer('deleted'))
    .addCase(RECONCILIATION_DELETE_INFLIGHT, createInflightReducer('deleted'))
    .addCase(RECONCILIATION_DELETE_ERROR, createErrorReducer('deleted'))
    .addCase(SEARCH_RECONCILIATIONS, (state, action) => {
      state.list.params.infix = action.infix;
    })

    .addCase(CLEAR_RECONCILIATIONS_SEARCH, (state) => {
      delete state.list.params.infix;
    })

    .addCase(NEW_RECONCILIATION_INFLIGHT, (state) => {
      state.createReportInflight = true;
    })
    .addCase(NEW_RECONCILIATION, (state) => {
      state.createReportInflight = false;
    })
    .addCase(FILTER_RECONCILIATIONS, (state, action) => {
      state.list.params[action.param.key] = action.param.value;
    })
    .addCase(CLEAR_RECONCILIATIONS_FILTER, (state, action) => {
      state.list.params[action.paramKey] = null;
    })
    .addCase(SEARCH_RECONCILIATION, (state, action) => {
      state.searchString = action.searchString;
    })

    .addCase(CLEAR_RECONCILIATION_SEARCH, (state) => {
      state.searchString = null;
    })
    .addCase(FILTER_RECONCILIATION, (state, action) => {
      state.list.params[action.param.key] = action.param.value;
    })
    .addCase(CLEAR_RECONCILIATION_FILTER, (state, action) => {
      state.list.params[action.paramKey] = null;
    });
});
