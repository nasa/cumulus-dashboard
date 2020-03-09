'use strict';
import { set, del } from 'object-path';
import assignDate from './assign-date';
import cloneDeep from 'lodash.clonedeep';

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

export default function reducer (state = initialState, action) {
  let newState = null;
  const { id, data } = action;
  switch (action.type) {
    case RECONCILIATION:
      newState = cloneDeep(state);
      set(newState, ['map', id, 'inflight'], false);
      set(newState, ['map', id, 'data'], assignDate(data));
      del(newState, ['deleted', id]);
      break;
    case RECONCILIATION_INFLIGHT:
      newState = cloneDeep(state);
      set(newState, ['map', id, 'inflight'], true);
      break;
    case RECONCILIATION_ERROR:
      newState = cloneDeep(state);
      set(newState, ['map', id, 'inflight'], false);
      set(newState, ['map', id, 'error'], action.error);
      break;

    case RECONCILIATIONS:
      newState = cloneDeep(state);
      // response.results is a array of string filenames
      const results = data.results.map((filename) => ({ reconciliationReportName: filename }));
      set(newState, ['list', 'data'], results);
      set(newState, ['list', 'meta'], assignDate(data.meta));
      set(newState, ['list', 'inflight'], false);
      set(newState, ['list', 'error'], false);
      break;
    case RECONCILIATIONS_INFLIGHT:
      newState = cloneDeep(state);
      set(newState, ['list', 'inflight'], true);
      break;
    case RECONCILIATIONS_ERROR:
      newState = cloneDeep(state);
      set(newState, ['list', 'inflight'], false);
      set(newState, ['list', 'error'], action.error);
      break;

    case SEARCH_RECONCILIATIONS:
      newState = cloneDeep(state);
      set(newState, ['list', 'params', 'prefix'], action.prefix);
      break;
    case CLEAR_RECONCILIATIONS_SEARCH:
      newState = cloneDeep(state);
      set(newState, ['list', 'params', 'prefix'], null);
      break;

    case NEW_RECONCILIATION_INFLIGHT:
      newState = {...state};
      set(newState, 'createReportInflight', true);
      break;

    case NEW_RECONCILIATION:
      newState = {...state};
      set(newState, 'createReportInflight', false);
      break;
  }
  return newState || state;
}
