'use strict';

import { createReducer } from '@reduxjs/toolkit';
import { deconstructCollectionId } from '../utils/format';
import assignDate from './utils/assign-date';
import {
  createClearItemReducer,
  createErrorReducer,
  createInflightReducer,
  createSuccessReducer
} from './utils/reducer-creators';
import {
  CLEAR_COLLECTIONS_FILTER,
  CLEAR_COLLECTIONS_SEARCH,
  COLLECTION_APPLYWORKFLOW_ERROR,
  COLLECTION_APPLYWORKFLOW_INFLIGHT,
  COLLECTION_APPLYWORKFLOW,
  COLLECTION_DELETE_ERROR,
  COLLECTION_DELETE_INFLIGHT,
  COLLECTION_DELETE,
  COLLECTION_ERROR,
  COLLECTION_INFLIGHT,
  COLLECTION,
  COLLECTIONS_ERROR,
  COLLECTIONS_INFLIGHT,
  COLLECTIONS,
  FILTER_COLLECTIONS,
  NEW_COLLECTION_ERROR,
  NEW_COLLECTION_INFLIGHT,
  NEW_COLLECTION,
  SEARCH_COLLECTIONS,
  UPDATE_COLLECTION_CLEAR,
  UPDATE_COLLECTION_ERROR,
  UPDATE_COLLECTION_INFLIGHT,
  UPDATE_COLLECTION,
} from '../actions/types';

export const initialState = {
  list: {
    data: [],
    meta: {},
    params: {},
  },
  created: {},
  deleted: {},
  executed: {},
  map: {},
  updated: {},
};

export default createReducer(initialState, {
  [COLLECTION]: ({ deleted, map }, { id, data }) => {
    const { name } = deconstructCollectionId(id);
    const collection = data.results.find((element) => element.name === name);

    map[id] = { data: assignDate(collection) };
    delete deleted[id];
  },
  [COLLECTION_INFLIGHT]: ({ map }, { id }) => {
    map[id] = { inflight: true };
  },
  [COLLECTION_ERROR]: ({ map }, { id, error }) => {
    map[id] = { error };
  },
  [COLLECTION_APPLYWORKFLOW]: createSuccessReducer('executed'),
  [COLLECTION_APPLYWORKFLOW_INFLIGHT]: createInflightReducer('executed'),
  [COLLECTION_APPLYWORKFLOW_ERROR]: createErrorReducer('executed'),
  [COLLECTIONS]: ({ list }, { data }) => {
    list.data = data.results;
    list.meta = assignDate(data.meta);
    list.inflight = false;
    list.error = false;
  },
  [COLLECTIONS_INFLIGHT]: ({ list }) => {
    list.inflight = true;
  },
  [COLLECTIONS_ERROR]: ({ list }, { error }) => {
    list.inflight = false;
    list.error = error;
  },
  [NEW_COLLECTION]: createSuccessReducer('created'),
  [NEW_COLLECTION_INFLIGHT]: createInflightReducer('created'),
  [NEW_COLLECTION_ERROR]: createErrorReducer('created'),
  [UPDATE_COLLECTION]: ({ map, updated }, { id, data }) => {
    map[id] = { data };
    updated[id] = { status: 'success' };
  },
  [UPDATE_COLLECTION_INFLIGHT]: createInflightReducer('updated'),
  [UPDATE_COLLECTION_ERROR]: createErrorReducer('updated'),
  [UPDATE_COLLECTION_CLEAR]: createClearItemReducer('updated'),
  [COLLECTION_DELETE]: createSuccessReducer('deleted'),
  [COLLECTION_DELETE_INFLIGHT]: createInflightReducer('deleted'),
  [COLLECTION_DELETE_ERROR]: createErrorReducer('deleted'),
  [SEARCH_COLLECTIONS]: ({ list }, { prefix }) => {
    list.params.prefix = prefix;
  },
  [CLEAR_COLLECTIONS_SEARCH]: ({ list }) => {
    list.params.prefix = null;
  },
  [FILTER_COLLECTIONS]: ({ list }, { param: { key, value } }) => {
    list.params[key] = value;
  },
  [CLEAR_COLLECTIONS_FILTER]: ({ list }, { paramKey }) => {
    list.params[paramKey] = null;
  },
});
