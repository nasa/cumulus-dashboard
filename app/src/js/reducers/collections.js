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
import { createReducer } from '@reduxjs/toolkit';
import { deconstructCollectionId } from '../utils/format';

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

export default createReducer(initialState, {
  [COLLECTION]: (state, action) => {
    const { id, data } = action;
    const { name } = deconstructCollectionId(id);
    const collection = data.results.find((element) => element.name === name);
    set(state, ['map', id, 'inflight'], false);
    set(state, ['map', id, 'data'], assignDate(collection));
    del(state, ['deleted', id]);
  },
  [COLLECTION_INFLIGHT]: (state, action) => {
    const { id } = action;
    set(state, ['map', id, 'inflight'], true);
  },
  [COLLECTION_ERROR]: (state, action) => {
    const { id } = action;
    set(state, ['map', id, 'inflight'], false);
    set(state, ['map', id, 'error'], action.error);
  },

  [COLLECTION_APPLYWORKFLOW]: (state, action) => {
    const { id } = action;
    set(state, ['executed', id, 'status'], 'success');
    set(state, ['executed', id, 'error'], null);
  },
  [COLLECTION_APPLYWORKFLOW_INFLIGHT]: (state, action) => {
    const { id } = action;
    set(state, ['executed', id, 'status'], 'inflight');
  },
  [COLLECTION_APPLYWORKFLOW_ERROR]: (state, action) => {
    const { id } = action;
    set(state, ['executed', id, 'status'], 'error');
    set(state, ['executed', id, 'error'], action.error);
  },

  [COLLECTIONS]: (state, action) => {
    const { data } = action;
    set(state, ['list', 'data'], data.results);
    set(state, ['list', 'meta'], assignDate(data.meta));
    set(state, ['list', 'inflight'], false);
    set(state, ['list', 'error'], false);
  },
  [COLLECTIONS_INFLIGHT]: (state, action) => {
    set(state, ['list', 'inflight'], true);
  },
  [COLLECTIONS_ERROR]: (state, action) => {
    set(state, ['list', 'inflight'], false);
    set(state, ['list', 'error'], action.error);
  },

  [NEW_COLLECTION]: (state, action) => {
    const { id } = action;
    set(state, ['created', id, 'status'], 'success');
  },
  [NEW_COLLECTION_INFLIGHT]: (state, action) => {
    const { id } = action;
    set(state, ['created', id, 'status'], 'inflight');
  },
  [NEW_COLLECTION_ERROR]: (state, action) => {
    const { id } = action;
    set(state, ['created', id, 'status'], 'error');
    set(state, ['created', id, 'error'], action.error);
  },

  [UPDATE_COLLECTION]: (state, action) => {
    const { id, data } = action;
    set(state, ['map', id, 'data'], data);
    set(state, ['updated', id, 'status'], 'success');
  },
  [UPDATE_COLLECTION_INFLIGHT]: (state, action) => {
    const { id } = action;
    set(state, ['updated', id, 'status'], 'inflight');
  },
  [UPDATE_COLLECTION_ERROR]: (state, action) => {
    const { id } = action;
    set(state, ['updated', id, 'status'], 'error');
    set(state, ['updated', id, 'error'], action.error);
  },
  [UPDATE_COLLECTION_CLEAR]: (state, action) => {
    const { id } = action;
    del(state, ['updated', id]);
  },

  [COLLECTION_DELETE]: (state, action) => {
    const { id } = action;
    set(state, ['deleted', id, 'status'], 'success');
    set(state, ['deleted', id, 'error'], null);
  },
  [COLLECTION_DELETE_INFLIGHT]: (state, action) => {
    const { id } = action;
    set(state, ['deleted', id, 'status'], 'inflight');
  },
  [COLLECTION_DELETE_ERROR]: (state, action) => {
    const { id } = action;
    set(state, ['deleted', id, 'status'], 'error');
    set(state, ['deleted', id, 'error'], action.error);
  },

  [SEARCH_COLLECTIONS]: (state, action) => {
    set(state, ['list', 'params', 'prefix'], action.prefix);
  },
  [CLEAR_COLLECTIONS_SEARCH]: (state, action) => {
    set(state, ['list', 'params', 'prefix'], null);
  },

  [FILTER_COLLECTIONS]: (state, action) => {
    set(state, ['list', 'params', action.param.key], action.param.value);
  },
  [CLEAR_COLLECTIONS_FILTER]: (state, action) => {
    set(state, ['list', 'params', action.paramKey], null);
  }
});
