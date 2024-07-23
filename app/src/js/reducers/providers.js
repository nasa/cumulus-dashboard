import objectPath from 'object-path';
import { createReducer } from '@reduxjs/toolkit';
import noop from 'lodash/noop.js';
import assignDate from './utils/assign-date.js';
import {
  createClearItemReducer,
  createErrorReducer,
  createInflightReducer,
  createSuccessReducer,
} from './utils/reducer-creators.js';
import {
  PROVIDER,
  PROVIDER_INFLIGHT,
  PROVIDER_ERROR,
  NEW_PROVIDER,
  NEW_PROVIDER_INFLIGHT,
  NEW_PROVIDER_ERROR,
  PROVIDER_COLLECTIONS,
  PROVIDER_COLLECTIONS_INFLIGHT,
  PROVIDER_COLLECTIONS_ERROR,
  UPDATE_PROVIDER,
  UPDATE_PROVIDER_INFLIGHT,
  UPDATE_PROVIDER_ERROR,
  UPDATE_PROVIDER_CLEAR,
  PROVIDERS,
  PROVIDERS_INFLIGHT,
  PROVIDERS_ERROR,
  SEARCH_PROVIDERS,
  CLEAR_PROVIDERS_SEARCH,
  FILTER_PROVIDERS,
  CLEAR_PROVIDERS_FILTER,
  PROVIDER_DELETE,
  PROVIDER_DELETE_INFLIGHT,
  PROVIDER_DELETE_ERROR,
  OPTIONS_PROVIDERNAME,
  OPTIONS_PROVIDERNAME_INFLIGHT,
  OPTIONS_PROVIDERNAME_ERROR,
} from '../actions/types.js';

export const initialState = {
  list: {
    data: [],
    meta: {},
    params: {},
  },
  dropdowns: {},
  map: {},
  search: {},
  collections: {},
  created: {},
  updated: {},
  deleted: {},
  restarted: {},
  stopped: {},
};

export default createReducer(initialState, (builder) => {
  builder
    .addCase(PROVIDER, (state, action) => {
      const { id, data } = action;

      state.map[id] = {
        inflight: false,
        data,
        error: null,
      };

      if (objectPath.get(state, ['deleted', id, 'status']) !== 'error') {
        delete state.deleted[id];
      }
    })
    .addCase(PROVIDER_INFLIGHT, (state, action) => {
      state.map[action.id] = { inflight: true };
    })
    .addCase(PROVIDER_ERROR, createErrorReducer('map'))
    // Created
    .addCase(NEW_PROVIDER, createSuccessReducer('created'))
    .addCase(NEW_PROVIDER_INFLIGHT, createInflightReducer('created'))
    .addCase(NEW_PROVIDER_ERROR, createErrorReducer('created'))
    // Collections
    .addCase(PROVIDER_COLLECTIONS, (state, { id, data }) => {
      state.collections[id] = {
        data: data.results.map((c) => c.collectionName),
      };
    })
    .addCase(PROVIDER_COLLECTIONS_INFLIGHT, (state, action) => {
      state.collections[action.id] = { inflight: true };
    })
    .addCase(PROVIDER_COLLECTIONS_ERROR, (state, action) => {
      state.collections[action.id] = {
        inflight: false,
        error: action.error,
      };
    })
    // Update
    .addCase(UPDATE_PROVIDER, (state, action) => {
      const { id, data } = action;
      state.map[id] = { data };
      state.updated = { ...state.updated, [id]: { status: 'success' } };
    })
    .addCase(UPDATE_PROVIDER_INFLIGHT, createInflightReducer('updated'))
    .addCase(UPDATE_PROVIDER_ERROR, createErrorReducer('updated'))
    .addCase(UPDATE_PROVIDER_CLEAR, createClearItemReducer('updated'))
    .addCase(PROVIDERS, (state, action) => {
      state.list.data = action.data.results;
      state.list.meta = assignDate(action.data.meta);
      state.list.inflight = false;
      state.list.error = false;
    })
    .addCase(PROVIDERS_INFLIGHT, (state) => {
      state.list.inflight = true;
    })
    // Error
    .addCase(PROVIDERS_ERROR, (state, action) => {
      state.list.inflight = false;
      state.list.error = action.error;
    })
    // Search
    .addCase(SEARCH_PROVIDERS, (state, action) => {
      state.list.params.infix = action.infix;
    })
    .addCase(CLEAR_PROVIDERS_SEARCH, (state) => {
      delete state.list.params.infix;
    })
    // Filter
    .addCase(FILTER_PROVIDERS, (state, action) => {
      state.list.params[action.param.key] = action.param.value;
    })
    .addCase(CLEAR_PROVIDERS_FILTER, (state, action) => {
      delete state.list.params[action.paramKey];
    })
    // Deleted
    .addCase(PROVIDER_DELETE, createSuccessReducer('deleted'))
    .addCase(PROVIDER_DELETE_INFLIGHT, createInflightReducer('deleted'))
    .addCase(PROVIDER_DELETE_ERROR, createErrorReducer('deleted'))
    // Options Name
    .addCase(OPTIONS_PROVIDERNAME, (state, action) => {
      // Map the list response to an object with key-value pairs like:
      // displayValue: optionElementValue
      const options = action.data.results.map((provider) => ({
        id: provider.id,
        label: provider.id,
      }));

      objectPath.set(state.dropdowns, 'provider.options', options);
    })
    .addCase(OPTIONS_PROVIDERNAME_INFLIGHT, noop)
    .addCase(OPTIONS_PROVIDERNAME_ERROR, (state, action) => {
      objectPath.set(state.dropdowns, 'provider.options', []);
      state.list.error = action.error;
    });
});
