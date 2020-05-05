'use strict';

import { get, set, del } from 'object-path';
import assignDate from './assign-date';
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
  OPTIONS_PROVIDERGROUP_ERROR
} from '../actions/types';
import { createReducer } from '@reduxjs/toolkit';

export const initialState = {
  list: {
    data: [],
    meta: {},
    params: {}
  },
  dropdowns: {},
  map: {},
  search: {},
  collections: {},
  created: {},
  updated: {},
  deleted: {},
  restarted: {},
  stopped: {}
};

export default createReducer(initialState, {

  [PROVIDER]: (state, action) => {
    const { data, id } = action;
    set(state, ['map', id, 'inflight'], false);
    set(state, ['map', id, 'data'], data);
    set(state, ['map', id, 'error'], null);
    if (get(state, ['deleted', id, 'status']) !== 'error') {
      del(state, ['deleted', id]);
    }
  },
  [PROVIDER_INFLIGHT]: (state, action) => {
    const { id } = action;
    set(state, ['map', id, 'inflight'], true);
  },
  [PROVIDER_ERROR]: (state, action) => {
    const { id } = action;
    set(state, ['map', id, 'inflight'], false);
    set(state, ['map', id, 'error'], action.error);
  },

  [NEW_PROVIDER]: (state, action) => {
    const { id } = action;
    set(state, ['created', id, 'status'], 'success');
  },
  [NEW_PROVIDER_INFLIGHT]: (state, action) => {
    const { id } = action;
    set(state, ['created', id, 'status'], 'inflight');
  },
  [NEW_PROVIDER_ERROR]: (state, action) => {
    const { id } = action;
    set(state, ['created', id, 'status'], 'error');
    set(state, ['created', id, 'error'], action.error);
  },

  [PROVIDER_COLLECTIONS]: (state, action) => {
    const { data, id } = action;
    set(state, ['collections', id, 'inflight'], false);
    set(state, ['collections', id, 'data'], data.results.map(c => c.collectionName));
  },
  [PROVIDER_COLLECTIONS_INFLIGHT]: (state, action) => {
    const { id } = action;
    set(state, ['collections', id, 'inflight'], true);
  },
  [PROVIDER_COLLECTIONS_ERROR]: (state, action) => {
    const { id } = action;
    set(state, ['collections', id, 'inflight'], false);
    set(state, ['collections', id, 'error'], action.error);
  },

  [UPDATE_PROVIDER]: (state, action) => {
    const { data, id } = action;
    set(state, ['map', id, 'data'], data);
    set(state, ['updated', id, 'status'], 'success');
  },
  [UPDATE_PROVIDER_INFLIGHT]: (state, action) => {
    const { id } = action;
    set(state, ['updated', id, 'status'], 'inflight');
  },
  [UPDATE_PROVIDER_ERROR]: (state, action) => {
    const { id } = action;
    set(state, ['updated', id, 'status'], 'error');
    set(state, ['updated', id, 'error'], action.error);
  },
  [UPDATE_PROVIDER_CLEAR]: (state, action) => {
    const { id } = action;
    del(state, ['updated', id]);
  },

  [PROVIDERS]: (state, action) => {
    const { data } = action;
    set(state, ['list', 'data'], data.results);
    set(state, ['list', 'meta'], assignDate(data.meta));
    set(state, ['list', 'inflight'], false);
    set(state, ['list', 'error'], false);
  },
  [PROVIDERS_INFLIGHT]: (state, action) => {
    set(state, ['list', 'inflight'], true);
  },
  [PROVIDERS_ERROR]: (state, action) => {
    set(state, ['list', 'inflight'], false);
    set(state, ['list', 'error'], action.error);
  },

  [SEARCH_PROVIDERS]: (state, action) => {
    set(state, ['list', 'params', 'prefix'], action.prefix);
  },
  [CLEAR_PROVIDERS_SEARCH]: (state, action) => {
    set(state, ['list', 'params', 'prefix'], null);
  },

  [FILTER_PROVIDERS]: (state, action) => {
    set(state, ['list', 'params', action.param.key], action.param.value);
  },
  [CLEAR_PROVIDERS_FILTER]: (state, action) => {
    set(state, ['list', 'params', action.paramKey], null);
  },

  [PROVIDER_DELETE]: (state, action) => {
    const { id } = action;
    set(state, ['deleted', id, 'status'], 'success');
    set(state, ['deleted', id, 'error'], null);
  },
  [PROVIDER_DELETE_INFLIGHT]: (state, action) => {
    const { id } = action;
    set(state, ['deleted', id, 'status'], 'inflight');
  },
  [PROVIDER_DELETE_ERROR]: (state, action) => {
    const { id } = action;
    set(state, ['deleted', id, 'status'], 'error');
    set(state, ['deleted', id, 'error'], action.error);
  },

  [OPTIONS_PROVIDERGROUP]: (state, action) => {
    const { data } = action;
    // Map the list response to an object with key-value pairs like:
    // displayValue: optionElementValue
    const options = data.results.reduce((obj, provider) => {
      // Several `results` items can share a `providerName`, but
      // these are de-duplciated by the key-value structure
      obj[provider.providerName] = provider.providerName;
      return obj;
    }, { '': '' });
    set(state, ['dropdowns', 'group', 'options'], options);
  },
  [OPTIONS_PROVIDERGROUP_INFLIGHT]: () => { },
  [OPTIONS_PROVIDERGROUP_ERROR]: (state, action) => {
    set(state, ['dropdowns', 'group', 'options'], []);
    set(state, ['list', 'error'], action.error);
  }
});
