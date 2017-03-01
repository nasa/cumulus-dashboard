'use strict';
import { set } from 'object-path';

import {
  COLLECTION,
  COLLECTION_INFLIGHT,
  COLLECTION_ERROR,

  COLLECTIONS,
  COLLECTIONS_INFLIGHT,
  COLLECTIONS_ERROR,

  NEW_COLLECTION,
  NEW_COLLECTION_INFLIGHT,
  NEW_COLLECTION_ERROR,

  UPDATE_COLLECTION,
  UPDATE_COLLECTION_INFLIGHT,
  UPDATE_COLLECTION_ERROR
} from '../actions';

export const initialState = {
  list: {
    data: [],
    meta: {}
  },
  map: {},
  meta: {},
  created: {},
  updated: {}
};

export default function reducer (state = initialState, action) {
  state = Object.assign({}, state);
  const { id, data } = action;

  switch (action.type) {
    case COLLECTION:
      set(state, ['map', id, 'inflight'], false);
      set(state, ['map', id, 'data'], data.results[0]);
      break;
    case COLLECTION_INFLIGHT:
      set(state, ['map', id, 'inflight'], true);
      break;
    case COLLECTION_ERROR:
      set(state, ['map', id, 'inflight'], false);
      set(state, ['map', id, 'error'], action.error);
      break;

    case COLLECTIONS:
      set(state, ['list', 'data'], data.results);
      set(state, ['list', 'meta'], data.meta);
      set(state, ['list', 'inflight'], false);
      break;
    case COLLECTIONS_INFLIGHT:
      set(state, ['list', 'inflight'], true);
      break;
    case COLLECTIONS_ERROR:
      set(state, ['list', 'inflight'], false);
      set(state, ['list', 'error'], action.error);
      break;

    case NEW_COLLECTION:
      set(state, ['created', id, 'status'], 'success');
      break;
    case NEW_COLLECTION_INFLIGHT:
      set(state, ['created', id, 'status'], 'inflight');
      break;
    case NEW_COLLECTION_ERROR:
      set(state, ['created', id, 'status'], 'error');
      set(state, ['created', id, 'error'], action.error);
      break;

    case UPDATE_COLLECTION:
      set(state, ['map', id, 'data'], data.Attributes);
      set(state, ['updated', id, 'status'], 'success');
      break;
    case UPDATE_COLLECTION_INFLIGHT:
      set(state, ['updated', id, 'status'], 'inflight');
      break;
    case UPDATE_COLLECTION_ERROR:
      set(state, ['updated', id, 'status'], 'error');
      set(state, ['updated', id, 'error'], action.error);
      break;
  }
  return state;
}
