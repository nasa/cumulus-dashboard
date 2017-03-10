'use strict';
import { set } from 'object-path';
import assignDate from './assign-date';

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
    meta: {
      query: {}
    }
  },
  search: {},
  map: {},
  meta: {},
  reprocessed: {}
};

export default function reducer (state = initialState, action) {
  state = Object.assign({}, state);
  const { id, data, config } = action;

  switch (action.type) {
    case GRANULE:
      set(state, ['map', id, 'inflight'], false);
      set(state, ['map', id, 'data'], assignDate(data));
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
      set(state, ['list', 'meta'], Object.assign(state.list.meta, assignDate(data.meta)));
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
      // Apply the search field's query to the list view's auto-updates
      set(state, ['list', 'meta', 'query', 'prefix'], config.qs.prefix);
      set(state, ['list', 'data'], data.results);
      set(state, ['search', 'inflight'], false);
      set(state, ['list', 'inflight'], false);
      break;
    case SEARCH_GRANULES_INFLIGHT:
      set(state, ['search', 'inflight'], true);
      set(state, ['list', 'inflight'], true);
      break;
    case SEARCH_GRANULES_ERROR:
      set(state, ['search', 'error'], action.error);
      set(state, ['search', 'inflight'], false);
      set(state, ['list', 'inflight'], false);
      break;
    case CLEAR_GRANULES_SEARCH:
      set(state, ['list', 'meta', 'query', 'prefix'], null);
      set(state, ['search', 'error'], null);
      set(state, ['search', 'inflight'], false);
      set(state, ['list', 'inflight'], false);
      break;
  }
  return state;
}
