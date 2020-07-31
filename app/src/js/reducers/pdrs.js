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
  [PDR]: (state, action) => {
    state.map[action.id] = {
      inflight: false,
      data: assignDate(action.data),
    };
    // https://github.com/nasa/cumulus-dashboard/issues/284
    delete state.deleted[action.id];
  },
  [PDR_INFLIGHT]: (state, action) => {
    state.map[action.id] = { inflight: true };
  },
  [PDR_ERROR]: (state, action) => {
    state.map[action.id] = {
      inflight: false,
      error: action.error,
    };
  },
  [PDRS]: (state, action) => {
    state.list.data = action.data.results;
    state.list.meta = assignDate(action.data.meta);
    state.list.inflight = false;
    state.list.error = false;
  },
  [PDRS_INFLIGHT]: (state) => {
    state.list.inflight = true;
  },
  [PDRS_ERROR]: (state, action) => {
    state.list.inflight = false;
    state.list.error = action.error;
  },
  [SEARCH_PDRS]: (state, action) => {
    state.list.params.infix = action.infix;
  },
  [CLEAR_PDRS_SEARCH]: (state) => {
    delete state.list.params.infix;
  },
  [FILTER_PDRS]: (state, action) => {
    state.list.params[action.param.key] = action.param.value;
  },
  [CLEAR_PDRS_FILTER]: (state, action) => {
    delete state.list.params[action.paramKey];
  },
  [PDR_DELETE]: createSuccessReducer('deleted'),
  [PDR_DELETE_INFLIGHT]: createInflightReducer('deleted'),
  [PDR_DELETE_ERROR]: createErrorReducer('deleted'),
});
