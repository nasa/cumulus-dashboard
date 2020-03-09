'use strict';
import { set, del } from 'object-path';
import assignDate from './assign-date';

import {
  COLLECTION,
  COLLECTION_INFLIGHT,
  COLLECTION_ERROR,

  COLLECTION_APPLYWORKFLOW,
  COLLECTION_APPLYWORKFLOW_INFLIGHT,
  COLLECTION_APPLYWORKFLOW_ERROR,

  COLLECTIONS,
  COLLECTIONS_INFLIGHT,
  COLLECTIONS_ERROR,

  NEW_COLLECTION,
  NEW_COLLECTION_INFLIGHT,
  NEW_COLLECTION_ERROR,

  COLLECTION_DELETE,
  COLLECTION_DELETE_INFLIGHT,
  COLLECTION_DELETE_ERROR,

  UPDATE_COLLECTION,
  UPDATE_COLLECTION_INFLIGHT,
  UPDATE_COLLECTION_ERROR,
  UPDATE_COLLECTION_CLEAR,

  SEARCH_COLLECTIONS,
  CLEAR_COLLECTIONS_SEARCH,

  FILTER_COLLECTIONS,
  CLEAR_COLLECTIONS_FILTER
} from '../actions/types';
import cloneDeep from 'lodash.clonedeep';

export const initialState = {
  list: {
    data: [],
    meta: {},
    params: {}
  },
  created: {},
  deleted: {},
  executed: {},
  map: {},
  updated: {}
};

export default function reducer (state = initialState, action) {
  let newState = null;
  const { id, data } = action;

  switch (action.type) {
    case COLLECTION:
      newState = cloneDeep(state);
      const colName = id.split('___');
      const collection = data.results.find(function (element) {
        return element.name === colName[0];
      });
      set(newState, ['map', id, 'inflight'], false);
      set(newState, ['map', id, 'data'], assignDate(collection));
      del(newState, ['deleted', id]);
      break;
    case COLLECTION_INFLIGHT:
      newState = cloneDeep(state);
      set(newState, ['map', id, 'inflight'], true);
      break;
    case COLLECTION_ERROR:
      newState = cloneDeep(state);
      set(newState, ['map', id, 'inflight'], false);
      set(newState, ['map', id, 'error'], action.error);
      break;

    case COLLECTION_APPLYWORKFLOW:
      newState = cloneDeep(state);
      set(newState, ['executed', id, 'status'], 'success');
      set(newState, ['executed', id, 'error'], null);
      break;
    case COLLECTION_APPLYWORKFLOW_INFLIGHT:
      newState = cloneDeep(state);
      set(newState, ['executed', id, 'status'], 'inflight');
      break;
    case COLLECTION_APPLYWORKFLOW_ERROR:
      newState = cloneDeep(state);
      set(newState, ['executed', id, 'status'], 'error');
      set(newState, ['executed', id, 'error'], action.error);
      break;

    case COLLECTIONS:
      newState = cloneDeep(state);
      set(newState, ['list', 'data'], data.results);
      set(newState, ['list', 'meta'], assignDate(data.meta));
      set(newState, ['list', 'inflight'], false);
      set(newState, ['list', 'error'], false);
      break;
    case COLLECTIONS_INFLIGHT:
      newState = cloneDeep(state);
      set(newState, ['list', 'inflight'], true);
      break;
    case COLLECTIONS_ERROR:
      newState = cloneDeep(state);
      set(newState, ['list', 'inflight'], false);
      set(newState, ['list', 'error'], action.error);
      break;

    case NEW_COLLECTION:
      newState = cloneDeep(state);
      set(newState, ['created', id, 'status'], 'success');
      break;
    case NEW_COLLECTION_INFLIGHT:
      newState = cloneDeep(state);
      set(newState, ['created', id, 'status'], 'inflight');
      break;
    case NEW_COLLECTION_ERROR:
      newState = cloneDeep(state);
      set(newState, ['created', id, 'status'], 'error');
      set(newState, ['created', id, 'error'], action.error);
      break;

    case UPDATE_COLLECTION:
      newState = cloneDeep(state);
      set(newState, ['map', id, 'data'], data);
      set(newState, ['updated', id, 'status'], 'success');
      break;
    case UPDATE_COLLECTION_INFLIGHT:
      newState = cloneDeep(state);
      set(newState, ['updated', id, 'status'], 'inflight');
      break;
    case UPDATE_COLLECTION_ERROR:
      newState = cloneDeep(state);
      set(newState, ['updated', id, 'status'], 'error');
      set(newState, ['updated', id, 'error'], action.error);
      break;
    case UPDATE_COLLECTION_CLEAR:
      newState = cloneDeep(state);
      del(newState, ['updated', id]);
      break;

    case COLLECTION_DELETE:
      newState = cloneDeep(state);
      set(newState, ['deleted', id, 'status'], 'success');
      set(newState, ['deleted', id, 'error'], null);
      break;
    case COLLECTION_DELETE_INFLIGHT:
      newState = cloneDeep(state);
      set(newState, ['deleted', id, 'status'], 'inflight');
      break;
    case COLLECTION_DELETE_ERROR:
      newState = cloneDeep(state);
      set(newState, ['deleted', id, 'status'], 'error');
      set(newState, ['deleted', id, 'error'], action.error);
      break;

    case SEARCH_COLLECTIONS:
      newState = cloneDeep(state);
      set(newState, ['list', 'params', 'prefix'], action.prefix);
      break;
    case CLEAR_COLLECTIONS_SEARCH:
      newState = cloneDeep(state);
      set(newState, ['list', 'params', 'prefix'], null);
      break;

    case FILTER_COLLECTIONS:
      newState = cloneDeep(state);
      set(newState, ['list', 'params', action.param.key], action.param.value);
      break;
    case CLEAR_COLLECTIONS_FILTER:
      newState = cloneDeep(state);
      set(newState, ['list', 'params', action.paramKey], null);
      break;
  }
  return newState || state;
}
