'use strict';

import { set } from 'object-path';
import assignDate from './assign-date';
import {
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
} from '../actions';

export const initialState = {
  list: {
    data: [],
    meta: {},
    params: {}
  },
  dropdowns: {},
  search: {},
  deleted: {}
};

export default function reducer (state = initialState, action) {
  state = Object.assign({}, state);
  const { data, id } = action;
  switch (action.type) {
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
