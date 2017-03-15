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
  CLEAR_GRANULES_SEARCH,

  FILTER_GRANULES,
  CLEAR_GRANULES_FILTER
} from '../actions';

export const initialState = {
  list: {
    data: [],
    meta: {},
    params: {}
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
      set(state, ['list', 'meta'], assignDate(data.meta));
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
      set(state, ['list', 'params', 'prefix'], action.prefix);
      break;
    case CLEAR_GRANULES_SEARCH:
      set(state, ['list', 'params', 'prefix'], null);
      break;

    case FILTER_GRANULES:
      set(state, ['list', 'params', action.param.key], action.param.value);
      break;
    case CLEAR_GRANULES_FILTER:
      set(state, ['list', 'params', action.paramKey], null);
      break;
  }
  return state;
}
