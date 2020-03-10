'use strict';

import { get, set, del } from 'object-path';
import assignDate from './assign-date';
import cloneDeep from 'lodash.clonedeep';
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

export default function reducer (state = initialState, action) {
  let newState = null;
  const { data, id } = action;
  switch (action.type) {
    case PROVIDER:
      newState = cloneDeep(state);
      set(newState, ['map', id, 'inflight'], false);
      set(newState, ['map', id, 'data'], data);
      set(newState, ['map', id, 'error'], null);
      if (get(newState, ['deleted', id, 'status']) !== 'error') {
        del(newState, ['deleted', id]);
      }
      break;
    case PROVIDER_INFLIGHT:
      newState = cloneDeep(state);
      set(newState, ['map', id, 'inflight'], true);
      break;
    case PROVIDER_ERROR:
      newState = cloneDeep(state);
      set(newState, ['map', id, 'inflight'], false);
      set(newState, ['map', id, 'error'], action.error);
      break;

    case NEW_PROVIDER:
      newState = cloneDeep(state);
      set(newState, ['created', id, 'status'], 'success');
      break;
    case NEW_PROVIDER_INFLIGHT:
      newState = cloneDeep(state);
      set(newState, ['created', id, 'status'], 'inflight');
      break;
    case NEW_PROVIDER_ERROR:
      newState = cloneDeep(state);
      set(newState, ['created', id, 'status'], 'error');
      set(newState, ['created', id, 'error'], action.error);
      break;

    case PROVIDER_COLLECTIONS:
      newState = cloneDeep(state);
      set(newState, ['collections', id, 'inflight'], false);
      set(newState, ['collections', id, 'data'], data.results.map(c => c.collectionName));
      break;
    case PROVIDER_COLLECTIONS_INFLIGHT:
      newState = cloneDeep(state);
      set(newState, ['collections', id, 'inflight'], true);
      break;
    case PROVIDER_COLLECTIONS_ERROR:
      newState = cloneDeep(state);
      set(newState, ['collections', id, 'inflight'], false);
      set(newState, ['collections', id, 'error'], action.error);
      break;

    case UPDATE_PROVIDER:
      // TODO [MHS, 2020-03-09] No IDEA what this problem is yet, but these require a shallow copy of the state.
      // console.log(`state: ${JSON.stringify(state)}`);
      newState = Object.assign({}, state);
      // newState = cloneDeep(state);
      set(newState, ['map', id, 'data'], data);
      set(newState, ['updated', id, 'status'], 'success');
      break;
    case UPDATE_PROVIDER_INFLIGHT:
      newState = cloneDeep(state);
      set(newState, ['updated', id, 'status'], 'inflight');
      break;
    case UPDATE_PROVIDER_ERROR:
      newState = cloneDeep(state);
      set(newState, ['updated', id, 'status'], 'error');
      set(newState, ['updated', id, 'error'], action.error);
      break;
    case UPDATE_PROVIDER_CLEAR:
      newState = cloneDeep(state);
      del(newState, ['updated', id]);
      break;

    case PROVIDERS:
      newState = cloneDeep(state);
      set(newState, ['list', 'data'], data.results);
      set(newState, ['list', 'meta'], assignDate(data.meta));
      set(newState, ['list', 'inflight'], false);
      set(newState, ['list', 'error'], false);
      break;
    case PROVIDERS_INFLIGHT:
      newState = cloneDeep(state);
      set(newState, ['list', 'inflight'], true);
      break;
    case PROVIDERS_ERROR:
      newState = cloneDeep(state);
      set(newState, ['list', 'inflight'], false);
      set(newState, ['list', 'error'], action.error);
      break;

    case SEARCH_PROVIDERS:
      newState = cloneDeep(state);
      set(newState, ['list', 'params', 'prefix'], action.prefix);
      break;
    case CLEAR_PROVIDERS_SEARCH:
      newState = cloneDeep(state);
      set(newState, ['list', 'params', 'prefix'], null);
      break;

    case FILTER_PROVIDERS:
      newState = cloneDeep(state);
      set(newState, ['list', 'params', action.param.key], action.param.value);
      break;
    case CLEAR_PROVIDERS_FILTER:
      newState = cloneDeep(state);
      set(newState, ['list', 'params', action.paramKey], null);
      break;

    case PROVIDER_DELETE:
      newState = cloneDeep(state);
      set(newState, ['deleted', id, 'status'], 'success');
      set(newState, ['deleted', id, 'error'], null);
      break;
    case PROVIDER_DELETE_INFLIGHT:
      newState = cloneDeep(state);
      set(newState, ['deleted', id, 'status'], 'inflight');
      break;
    case PROVIDER_DELETE_ERROR:
      newState = cloneDeep(state);
      set(newState, ['deleted', id, 'status'], 'error');
      set(newState, ['deleted', id, 'error'], action.error);
      break;

    case OPTIONS_PROVIDERGROUP:
      newState = cloneDeep(state);
      // Map the list response to an object with key-value pairs like:
      // displayValue: optionElementValue
      const options = data.results.reduce((obj, provider) => {
        // Several `results` items can share a `providerName`, but
        // these are de-duplciated by the key-value structure
        obj[provider.providerName] = provider.providerName;
        return obj;
      }, {'': ''});
      set(newState, ['dropdowns', 'group', 'options'], options);
      break;
    case OPTIONS_PROVIDERGROUP_INFLIGHT:
      break;
    case OPTIONS_PROVIDERGROUP_ERROR:
      newState = cloneDeep(state);
      set(newState, ['dropdowns', 'group', 'options'], []);
      set(newState, ['list', 'error'], action.error);
      break;
  }
  return newState || state;
}
