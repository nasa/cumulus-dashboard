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
  [RECONCILIATION]: ({ map, deleted }, { id, data }) => {
    map[id] = { data: assignDate(data) };
    delete deleted[id];
  },
  [RECONCILIATION_INFLIGHT]: ({ map }, { id }) => {
    map[id] = { inflight: true };
  },
  [RECONCILIATION_ERROR]: ({ map }, { id, error }) => {
    map[id] = { error };
  },
  [RECONCILIATIONS]: ({ list }, { data }) => {
    // response.results is a array of string filenames
    const reports = data.results.map((filename) => ({
      reconciliationReportName: filename,
    }));
    list.data = reports;
    list.meta = assignDate(data.meta);
    list.inflight = false;
    list.error = false;
  },
  [RECONCILIATIONS_INFLIGHT]: ({ list }) => {
    list.inflight = true;
  },
  [RECONCILIATIONS_ERROR]: ({ list }, { error }) => {
    list.inflight = false;
    list.error = error;
  },
  [SEARCH_RECONCILIATIONS]: ({ list }, { prefix }) => {
    list.params.prefix = prefix;
  },
  [CLEAR_RECONCILIATIONS_SEARCH]: ({ list }) => {
    delete list.params.prefix;
  },
  [NEW_RECONCILIATION_INFLIGHT]: (draftState) => {
    draftState.createReportInflight = true;
  },
  [NEW_RECONCILIATION]: (draftState) => {
    draftState.createReportInflight = false;
  },
});
