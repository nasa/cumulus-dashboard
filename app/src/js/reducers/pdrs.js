import { createReducer } from '@reduxjs/toolkit';
import assignDate from './utils/assign-date.js';
import {
  createErrorReducer,
  createInflightReducer,
  createSuccessReducer,
} from './utils/reducer-creators.js';
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
} from '../actions/types.js';

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

export default createReducer(initialState, (builder) => {
  builder
    .addCase(PDR, (state, action) => {
      state.map[action.id] = {
        inflight: false,
        data: assignDate(action.data),
      };
      // https://github.com/nasa/cumulus-dashboard/issues/284
      delete state.deleted[action.id];
    })
    .addCase(PDR_INFLIGHT, (state, action) => {
      state.map[action.id] = { inflight: true };
    })
    .addCase(PDR_ERROR, (state, action) => {
      state.map[action.id] = {
        inflight: false,
        error: action.error,
      };
    })
    .addCase(PDRS, (state, action) => {
      state.list.data = action.data.results;
      state.list.meta = assignDate(action.data.meta);
      state.list.inflight = false;
      state.list.error = false;
    })
    .addCase(PDRS_INFLIGHT, (state) => {
      state.list.inflight = true;
    })
    .addCase(PDRS_ERROR, (state, action) => {
      state.list.inflight = false;
      state.list.error = action.error;
    })
    // Search
    .addCase(SEARCH_PDRS, (state, action) => {
      state.list.params.infix = action.infix;
    })
    .addCase(CLEAR_PDRS_SEARCH, (state) => {
      delete state.list.params.infix;
    })
    // Filter
    .addCase(FILTER_PDRS, (state, action) => {
      state.list.params[action.param.key] = action.param.value;
    })
    .addCase(CLEAR_PDRS_FILTER, (state, action) => {
      delete state.list.params[action.paramKey];
    })
    // Deleted
    .addCase(PDR_DELETE, createSuccessReducer('deleted'))
    .addCase(PDR_DELETE_INFLIGHT, createInflightReducer('deleted'))
    .addCase(PDR_DELETE_ERROR, createErrorReducer('deleted'));
});
