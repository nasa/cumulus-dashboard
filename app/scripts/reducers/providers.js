'use strict';

import { set, del } from 'object-path';
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

  PROVIDER_RESTART,
  PROVIDER_RESTART_INFLIGHT,
  PROVIDER_RESTART_ERROR,
  CLEAR_RESTARTED_PROVIDER,

  PROVIDER_STOP,
  PROVIDER_STOP_INFLIGHT,
  PROVIDER_STOP_ERROR,
  CLEAR_STOPPED_PROVIDER,

  OPTIONS_PROVIDERGROUP,
  OPTIONS_PROVIDERGROUP_INFLIGHT,
  OPTIONS_PROVIDERGROUP_ERROR
} from '../actions';

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
  state = Object.assign({}, state);
  const { data, id } = action;
  switch (action.type) {
    case PROVIDER:
      set(state, ['map', id, 'inflight'], false);
      set(state, ['map', id, 'data'], assignDate(data));
      del(state, ['deleted', id]);
      break;
    case PROVIDER_INFLIGHT:
      set(state, ['map', id, 'inflight'], true);
      break;
    case PROVIDER_ERROR:
      set(state, ['map', id, 'inflight'], false);
      set(state, ['map', id, 'error'], action.error);
      break;

    case NEW_PROVIDER:
      set(state, ['created', id, 'status'], 'success');
      break;
    case NEW_PROVIDER_INFLIGHT:
      set(state, ['created', id, 'status'], 'inflight');
      break;
    case NEW_PROVIDER_ERROR:
      set(state, ['created', id, 'status'], 'error');
      set(state, ['created', id, 'error'], action.error);
      break;

    case PROVIDER_COLLECTIONS:
      set(state, ['collections', id, 'inflight'], false);
      set(state, ['collections', id, 'data'], data.results.map(c => c.collectionName));
      break;
    case PROVIDER_COLLECTIONS_INFLIGHT:
      set(state, ['collections', id, 'inflight'], true);
      break;
    case PROVIDER_COLLECTIONS_ERROR:
      set(state, ['collections', id, 'inflight'], false);
      set(state, ['collections', id, 'error'], action.error);
      break;

    case UPDATE_PROVIDER:
      set(state, ['map', id, 'data'], data);
      set(state, ['updated', id, 'status'], 'success');
      break;
    case UPDATE_PROVIDER_INFLIGHT:
      set(state, ['updated', id, 'status'], 'inflight');
      break;
    case UPDATE_PROVIDER_ERROR:
      set(state, ['updated', id, 'status'], 'error');
      set(state, ['updated', id, 'error'], action.error);
      break;
    case UPDATE_PROVIDER_CLEAR:
      del(state, ['updated', id]);
      break;

    case PROVIDERS:
      set(state, ['list', 'data'], data.results);
      set(state, ['list', 'meta'], assignDate(data.meta));
      set(state, ['list', 'inflight'], false);
      break;
    case PROVIDERS_INFLIGHT:
      set(state, ['list', 'inflight'], true);
      break;
    case PROVIDERS_ERROR:
      set(state, ['list', 'inflight'], false);
      set(state, ['list', 'error'], action.error);
      break;

    case SEARCH_PROVIDERS:
      set(state, ['list', 'params', 'prefix'], action.prefix);
      break;
    case CLEAR_PROVIDERS_SEARCH:
      set(state, ['list', 'params', 'prefix'], null);
      break;

    case FILTER_PROVIDERS:
      set(state, ['list', 'params', action.param.key], action.param.value);
      break;
    case CLEAR_PROVIDERS_FILTER:
      set(state, ['list', 'params', action.paramKey], null);
      break;

    case PROVIDER_DELETE:
      set(state, ['deleted', id, 'status'], 'success');
      set(state, ['deleted', id, 'error'], null);
      break;
    case PROVIDER_DELETE_INFLIGHT:
      set(state, ['deleted', id, 'status'], 'inflight');
      break;
    case PROVIDER_DELETE_ERROR:
      set(state, ['deleted', id, 'status'], 'error');
      set(state, ['deleted', id, 'error'], action.error);
      break;

    case PROVIDER_RESTART:
      set(state, ['restarted', id, 'status'], 'success');
      set(state, ['restarted', id, 'error'], null);
      break;
    case PROVIDER_RESTART_INFLIGHT:
      set(state, ['restarted', id, 'status'], 'inflight');
      break;
    case PROVIDER_RESTART_ERROR:
      set(state, ['restarted', id, 'status'], 'error');
      set(state, ['restarted', id, 'error'], action.error);
      break;
    case CLEAR_RESTARTED_PROVIDER:
      del(state, ['restarted', id]);
      break;

    case PROVIDER_STOP:
      set(state, ['stopped', id, 'status'], 'success');
      set(state, ['stopped', id, 'error'], null);
      break;
    case PROVIDER_STOP_INFLIGHT:
      set(state, ['stopped', id, 'status'], 'inflight');
      break;
    case PROVIDER_STOP_ERROR:
      set(state, ['stopped', id, 'status'], 'error');
      set(state, ['stopped', id, 'error'], action.error);
      break;
    case CLEAR_STOPPED_PROVIDER:
      del(state, ['stopped', id]);
      break;

    case OPTIONS_PROVIDERGROUP:
      // Map the list response to an object with key-value pairs like:
      // displayValue: optionElementValue
      const options = data.results.reduce((obj, provider) => {
        // Several `results` items can share a `providerName`, but
        // these are de-duplciated by the key-value structure
        obj[provider.providerName] = provider.providerName;
        return obj;
      }, {'': ''});
      set(state, ['dropdowns', 'group', 'options'], options);
      break;
    case OPTIONS_PROVIDERGROUP_INFLIGHT:
      break;
    case OPTIONS_PROVIDERGROUP_ERROR:
      set(state, ['dropdowns', 'group', 'options'], []);
      set(state, ['list', 'error'], action.error);
      break;
  }
  return state;
}
