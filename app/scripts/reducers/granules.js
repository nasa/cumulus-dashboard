'use strict';
import { set } from 'object-path';

import {
  GRANULE,
  GRANULE_INFLIGHT,
  GRANULE_ERROR,

  GRANULES,
  GRANULES_INFLIGHT,
  GRANULES_ERROR,

  GRANULE_REPROCESS,
  GRANULE_REPROCESS_INFLIGHT,
  GRANULE_REPROCESS_ERROR,

  SEARCH_GRANULES,
  SEARCH_GRANULES_INFLIGHT,
  SEARCH_GRANULES_ERROR,
  CLEAR_GRANULES_SEARCH
} from '../actions';

export const initialState = {
  list: {
    data: [],
    meta: {}
  },
  search: {
    data: []
  },
  map: {},
  meta: {},
  reprocessed: {}
};

export default function reducer (state = initialState, action) {
  state = Object.assign({}, state);
  const { id, data } = action;

  switch (action.type) {
    case GRANULE:
      set(state, ['map', id, 'inflight'], false);
      set(state, ['map', id, 'data'], data);
      break;
    case GRANULE_INFLIGHT:
      set(state, ['map', id, 'inflight'], true);
      break;
    case GRANULE_ERROR:
      set(state, ['map', id, 'inflight'], false);
      set(state, ['map', id, 'error'], action.error);
      break;

    case GRANULES:
      set(state, ['list', 'data'], data.results);
      set(state, ['list', 'meta'], data.meta);
      set(state, ['list', 'inflight'], false);
      break;
    case GRANULES_INFLIGHT:
      set(state, ['list', 'inflight'], true);
      break;
    case GRANULES_ERROR:
      set(state, ['list', 'inflight'], false);
      set(state, ['list', 'error'], action.error);
      break;

    case GRANULE_REPROCESS:
      set(state, ['reprocessed', id, 'status'], 'success');
      break;
    case GRANULE_REPROCESS_INFLIGHT:
      set(state, ['reprocessed', id, 'status'], 'inflight');
      break;
    case GRANULE_REPROCESS_ERROR:
      set(state, ['reprocessed', id, 'status'], 'error');
      set(state, ['reprocessed', id, 'error'], action.error);
      break;

    case SEARCH_GRANULES:
      set(state, ['search', 'data'], data.results);
      set(state, ['search', 'inflight'], false);
      break;
    case SEARCH_GRANULES_INFLIGHT:
      set(state, ['search', 'inflight'], true);
      break;
    case SEARCH_GRANULES_ERROR:
      set(state, ['search', 'error'], action.error);
      set(state, ['search', 'inflight'], false);
      break;
    case CLEAR_GRANULES_SEARCH:
      set(state, ['search', 'data'], []);
      set(state, ['search', 'error'], null);
      set(state, ['search', 'inflight'], false);
      break;
  }
  return state;
}
