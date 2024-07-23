/* eslint-disable import/no-cycle */
import { createReducer } from '@reduxjs/toolkit';
import { set } from 'object-path';
import noop from 'lodash/noop.js';
import { deconstructCollectionId, getCollectionId } from '../utils/format.js';
import assignDate from './utils/assign-date.js';
import {
  createClearItemReducer,
  createErrorReducer,
  createInflightReducer,
  createSuccessReducer,
} from './utils/reducer-creators.js';
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
  OPTIONS_COLLECTIONNAME,
  OPTIONS_COLLECTIONNAME_INFLIGHT,
  OPTIONS_COLLECTIONNAME_ERROR,
} from '../actions/types.js';

export const initialState = {
  list: {
    data: [],
    meta: {},
    params: {},
  },
  dropdowns: {},
  created: {},
  deleted: {},
  executed: {},
  map: {},
  updated: {},
};

export default createReducer(initialState, (builder) => {
  builder
    .addCase(COLLECTION, (state, action) => {
      const { id, data } = action;
      const { name } = deconstructCollectionId(id);
      const collection = data.results.find((element) => element.name === name);

      state.map[id] = {
        inflight: false,
        data: assignDate(collection),
      };
      delete state.deleted[id];
    })
    .addCase(COLLECTION_INFLIGHT, (state, action) => {
      state.map[action.id] = { inflight: true };
    })
    .addCase(COLLECTION_ERROR, (state, action) => {
      const { id, error } = action;
      state.map[id] = {
        inflight: false,
        error,
      };
    })
    .addCase(COLLECTION_APPLYWORKFLOW, (state, action) => {
      state.executed[action.id] = {
        status: 'success',
        error: null,
      };
    })
    // Executed
    .addCase(
      COLLECTION_APPLYWORKFLOW_INFLIGHT,
      createInflightReducer('executed')
    )
    .addCase(COLLECTION_APPLYWORKFLOW_ERROR, createErrorReducer('executed'))
    .addCase(COLLECTIONS, (state, action) => {
      state.list.data = action.data.results || [];
      state.list.meta = assignDate(action.data.meta);
      state.list.inflight = false;
      state.list.error = false;
    })
    .addCase(COLLECTIONS_INFLIGHT, (state) => {
      state.list.inflight = true;
    })
    .addCase(COLLECTIONS_ERROR, (state, action) => {
      state.list.inflight = false;
      state.list.error = action.error;
    })
    // Created
    .addCase(NEW_COLLECTION, createSuccessReducer('created'))
    .addCase(NEW_COLLECTION_INFLIGHT, createInflightReducer('created'))
    .addCase(NEW_COLLECTION_ERROR, createErrorReducer('created'))
    .addCase(UPDATE_COLLECTION, (state, action) => {
      const { id, data } = action;
      state.map[id] = { data };
      state.updated[id] = { status: 'success' };
    })
    // Updated
    .addCase(UPDATE_COLLECTION_INFLIGHT, createInflightReducer('updated'))
    .addCase(UPDATE_COLLECTION_ERROR, createErrorReducer('updated'))
    .addCase(UPDATE_COLLECTION_CLEAR, createClearItemReducer('updated'))
    .addCase(COLLECTION_DELETE, (state, action) => {
      state.deleted[action.id] = {
        status: 'success',
        error: null,
      };
    })
    // Deleted
    .addCase(COLLECTION_DELETE_INFLIGHT, createInflightReducer('deleted'))
    .addCase(COLLECTION_DELETE_ERROR, createErrorReducer('deleted'))
    // Search and Filter
    .addCase(SEARCH_COLLECTIONS, (state, action) => {
      state.list.params.infix = action.infix;
    })
    .addCase(CLEAR_COLLECTIONS_SEARCH, (state) => {
      state.list.params.infix = null;
    })
    .addCase(FILTER_COLLECTIONS, (state, action) => {
      const { key, value } = action.param;
      state.list.params[key] = value;
    })
    .addCase(CLEAR_COLLECTIONS_FILTER, (state, action) => {
      state.list.params[action.paramKey] = null;
    })
    // Options Dropdown
    .addCase(OPTIONS_COLLECTIONNAME, (state, action) => {
      const options = action.data.results.map(({ name, version }) => {
        const collectionId = getCollectionId({ name, version });
        return {
          id: collectionId,
          label: collectionId,
        };
      });
      set(state.dropdowns, 'collectionName.options', options);
    })
    .addCase(OPTIONS_COLLECTIONNAME_INFLIGHT, noop)
    .addCase(OPTIONS_COLLECTIONNAME_ERROR, (state, action) => {
      set(state.dropdowns, 'collectionName.options', []);
      state.list.error = action.error;
    });
});
