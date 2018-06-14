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
  CLEAR_RECONCILIATIONS_SEARCH
} from '../actions';

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

export default function reducer (state = initialState, action) {
  state = Object.assign({}, state);
  const { id, data } = action;
  switch (action.type) {
    case RECONCILIATION:
      set(state, ['map', id, 'inflight'], false);
      set(state, ['map', id, 'data'], assignDate(data));
      del(state, ['deleted', id]);
      break;
    case RECONCILIATION_INFLIGHT:
      set(state, ['map', id, 'inflight'], true);
      break;
    case RECONCILIATION_ERROR:
      set(state, ['map', id, 'inflight'], false);
      set(state, ['map', id, 'error'], action.error);
      break;

    case RECONCILIATIONS:
      // response is a array of string filenames
      const results = data.map((filename) => ({ reconciliationReportName: filename }));
      set(state, ['list', 'data'], results);
      set(state, ['list', 'meta'], assignDate(data.meta));
      set(state, ['list', 'inflight'], false);
      set(state, ['list', 'error'], false);
      break;
    case RECONCILIATIONS_INFLIGHT:
      set(state, ['list', 'inflight'], true);
      break;
    case RECONCILIATIONS_ERROR:
      set(state, ['list', 'inflight'], false);
      set(state, ['list', 'error'], action.error);
      break;

    case SEARCH_RECONCILIATIONS:
      set(state, ['list', 'params', 'prefix'], action.prefix);
      break;
    case CLEAR_RECONCILIATIONS_SEARCH:
      set(state, ['list', 'params', 'prefix'], null);
      break;
  }
  return state;
}
