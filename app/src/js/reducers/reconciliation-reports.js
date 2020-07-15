'use strict';

import assignDate from './utils/assign-date';
import { createReducer } from '@reduxjs/toolkit';
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
  NEW_RECONCILIATION,
  FILTER_RECONCILIATIONS,
  CLEAR_RECONCILIATIONS_FILTER,
  SEARCH_RECONCILIATION,
  CLEAR_RECONCILIATION_SEARCH,
  FILTER_RECONCILIATION,
  CLEAR_RECONCILIATION_FILTER,
} from '../actions/types';

const filterData = (data, filterString) => {
  if (filterString) {
    data.filesInCumulus.onlyInDynamoDb = data.filesInCumulus.onlyInDynamoDb.filter((granule) => granule.granuleId.toLowerCase().includes(filterString.toLowerCase()));
    data.filesInCumulus.onlyInS3 = data.filesInCumulus.onlyInS3.filter((fileName) => fileName.toLowerCase().includes(filterString.toLowerCase()));
    data.collectionsInCumulusCmr.onlyInCumulus = data.collectionsInCumulusCmr.onlyInCumulus.filter((collection) => collection.toLowerCase().includes(filterString.toLowerCase()));
    data.collectionsInCumulusCmr.onlyInCmr = data.collectionsInCumulusCmr.onlyInCmr.filter((collection) => collection.toLowerCase().includes(filterString.toLowerCase()));
    data.granulesInCumulusCmr.onlyInCumulus = data.granulesInCumulusCmr.onlyInCumulus.filter((granule) => granule.granuleId.toLowerCase().includes(filterString.toLowerCase()));
    data.granulesInCumulusCmr.onlyInCmr = data.granulesInCumulusCmr.onlyInCmr.filter((granule) => granule.GranuleUR.toLowerCase().includes(filterString.toLowerCase()));
    data.filesInCumulusCmr.onlyInCumulus = data.filesInCumulusCmr.onlyInCumulus.filter((file) => file.granuleId.toLowerCase().includes(filterString.toLowerCase()));
    data.filesInCumulusCmr.onlyInCmr = data.filesInCumulusCmr.onlyInCmr.filter((file) => file.GranuleUR.toLowerCase().includes(filterString.toLowerCase()));
  }
  return data;
};

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
    // console.log('RECONCILLIATION: ' + JSON.stringify(action));
    state.map[action.id] = {
      inflight: false,
      data: assignDate(filterData(action.data, state.searchString)),
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
