'use strict';

import { get } from 'object-path';
import { createReducer } from '@reduxjs/toolkit';
import assignDate from './utils/assign-date';
import {
  createClearItemReducer,
  createErrorReducer,
  createInflightReducer,
  createSuccessReducer,
} from './utils/reducer-creators';
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
  OPTIONS_PROVIDERGROUP,
  OPTIONS_PROVIDERGROUP_INFLIGHT,
  OPTIONS_PROVIDERGROUP_ERROR,
} from '../actions/types';

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

export default createReducer(initialState, {
  [PROVIDER]: (draftState, { id, data }) => {
    draftState.map[id].data = data;

    delete draftState.map[id].inflight;
    delete draftState.map[id].error;

    if (get(draftState, ['deleted', id, 'status']) !== 'error') {
      delete draftState.deleted[id];
    }
  },
  [PROVIDER_INFLIGHT]: ({ map }, { id }) => {
    map[id] = { inflight: true };
  },
  [PROVIDER_ERROR]: createErrorReducer('map'),
  [NEW_PROVIDER]: createSuccessReducer('created'),
  [NEW_PROVIDER_INFLIGHT]: createInflightReducer('created'),
  [NEW_PROVIDER_ERROR]: createErrorReducer('created'),
  [PROVIDER_COLLECTIONS]: ({ collections }, { id, data }) => {
    collections[id] = { data: data.results.map((c) => c.collectionName) };
  },
  [PROVIDER_COLLECTIONS_INFLIGHT]: ({ collections }, { id }) => {
    collections[id] = { inflight: true };
  },
  [PROVIDER_COLLECTIONS_ERROR]: ({ collections }, { id, error }) => {
    collections[id] = { error };
  },
  [UPDATE_PROVIDER]: (draftState, action) => {
    const { id, data } = action;
    draftState.map[id] = { data };
    createSuccessReducer('updated')(draftState, action);
  },
  [UPDATE_PROVIDER_INFLIGHT]: createInflightReducer('updated'),
  [UPDATE_PROVIDER_ERROR]: createErrorReducer('updated'),
  [UPDATE_PROVIDER_CLEAR]: createClearItemReducer('updated'),
  [PROVIDERS]: ({ list }, { data }) => {
    list.data = data.results;
    list.meta = assignDate(data.meta);
    list.inflight = false;
    list.error = false;
  },
  [PROVIDERS]: ({ list }, { data }) => {
    list.data = data.results;
    list.meta = assignDate(data.meta);
    list.inflight = false;
    list.error = false;
  },
  [PROVIDERS_INFLIGHT]: ({ list }) => {
    list.inflight = true;
  },
  [PROVIDERS_ERROR]: ({ list }, { error }) => {
    list.inflight = false;
    list.error = error;
  },
  [SEARCH_PROVIDERS]: ({ list }, { prefix }) => {
    list.params.prefix = prefix;
  },
  [CLEAR_PROVIDERS_SEARCH]: ({ list }) => {
    delete list.params.prefix;
  },
  [FILTER_PROVIDERS]: ({ list }, { param }) => {
    list.params[param.key] = param.value;
  },
  [CLEAR_PROVIDERS_FILTER]: ({ list }, { paramKey }) => {
    delete list.params[paramKey];
  },
  [PROVIDER_DELETE]: createSuccessReducer('deleted'),
  [PROVIDER_DELETE_INFLIGHT]: createInflightReducer('deleted'),
  [PROVIDER_DELETE_ERROR]: createErrorReducer('deleted'),
  [OPTIONS_PROVIDERGROUP]: ({ dropdowns }, { data }) => {
    // Map the list response to an object with key-value pairs like:
    // displayValue: optionElementValue
    dropdowns.group = {
      options: data.results.reduce(
        (obj, provider) => {
          // Several `results` items can share a `providerName`, but
          // these are de-duplciated by the key-value structure
          obj[provider.providerName] = provider.providerName;
          return obj;
        },
        { '': '' }
      ),
    };
  },
  [OPTIONS_PROVIDERGROUP_INFLIGHT]: () => {},
  [OPTIONS_PROVIDERGROUP_ERROR]: ({ dropdowns, list }, { error }) => {
    dropdowns.group = { options: [] };
    list.error = error;
  },
});
