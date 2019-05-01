'use strict';
import { set, del } from 'object-path';
import assignDate from './assign-date';
import removeDeleted from './remove-deleted';

import {
  GRANULE,
  GRANULE_INFLIGHT,
  GRANULE_ERROR,

  RECENT_GRANULES,
  RECENT_GRANULES_INFLIGHT,
  RECENT_GRANULES_ERROR,

  GRANULES,
  GRANULES_INFLIGHT,
  GRANULES_ERROR,

  GRANULE_REPROCESS,
  GRANULE_REPROCESS_INFLIGHT,
  GRANULE_REPROCESS_ERROR,

  GRANULE_REINGEST,
  GRANULE_REINGEST_INFLIGHT,
  GRANULE_REINGEST_ERROR,

  GRANULE_APPLYWORKFLOW,
  GRANULE_APPLYWORKFLOW_INFLIGHT,
  GRANULE_APPLYWORKFLOW_ERROR,

  GRANULE_REMOVE,
  GRANULE_REMOVE_INFLIGHT,
  GRANULE_REMOVE_ERROR,

  GRANULE_RECOVER,
  GRANULE_RECOVER_INFLIGHT,
  GRANULE_RECOVER_ERROR,

  GRANULE_DELETE,
  GRANULE_DELETE_INFLIGHT,
  GRANULE_DELETE_ERROR,

  SEARCH_GRANULES,
  CLEAR_GRANULES_SEARCH,

  FILTER_GRANULES,
  CLEAR_GRANULES_FILTER,

  OPTIONS_COLLECTIONNAME,
  OPTIONS_COLLECTIONNAME_INFLIGHT,
  OPTIONS_COLLECTIONNAME_ERROR
} from '../actions/types';

export const initialState = {
  list: {
    data: [],
    meta: {},
    params: {}
  },
  dropdowns: {},
  map: {},
  meta: {},
  reprocessed: {},
  removed: {},
  reingested: {},
  executed: {},
  deleted: {},
  recent: {}
};

export default function reducer (state = initialState, action) {
  state = Object.assign({}, state);
  const { id, data } = action;

  switch (action.type) {
    case GRANULE:
      set(state, ['map', id, 'inflight'], false);
      set(state, ['map', id, 'data'], assignDate(data));
      del(state, ['deleted', id]);
      break;
    case GRANULE_INFLIGHT:
      set(state, ['map', id, 'inflight'], true);
      break;
    case GRANULE_ERROR:
      set(state, ['map', id, 'inflight'], false);
      set(state, ['map', id, 'error'], action.error);
      break;

    case GRANULES:
      set(state, ['list', 'data'], removeDeleted('granuleId', data.results, state.deleted));
      set(state, ['list', 'meta'], assignDate(data.meta));
      set(state, ['list', 'inflight'], false);
      set(state, ['list', 'error'], false);
      break;
    case GRANULES_INFLIGHT:
      set(state, ['list', 'inflight'], true);
      break;
    case GRANULES_ERROR:
      set(state, ['list', 'inflight'], false);
      set(state, ['list', 'error'], action.error);
      break;

    // basically a dummy query to get the meta object,
    // which contains the number of granules updated in the last hour.
    case RECENT_GRANULES:
      set(state, ['recent', 'data'], data.meta);
      set(state, ['recent', 'inflight'], false);
      break;
    case RECENT_GRANULES_INFLIGHT:
      set(state, ['recent', 'inflight'], true);
      break;
    case RECENT_GRANULES_ERROR:
      set(state, ['recent', 'inflight'], false);
      set(state, ['recent', 'error'], action.error);
      break;

    case GRANULE_REPROCESS:
      set(state, ['reprocessed', id, 'status'], 'success');
      set(state, ['reprocessed', id, 'error'], null);
      break;
    case GRANULE_REPROCESS_INFLIGHT:
      set(state, ['reprocessed', id, 'status'], 'inflight');
      break;
    case GRANULE_REPROCESS_ERROR:
      set(state, ['reprocessed', id, 'status'], 'error');
      set(state, ['reprocessed', id, 'error'], action.error);
      break;

    case GRANULE_REINGEST:
      set(state, ['reingested', id, 'status'], 'success');
      set(state, ['reingested', id, 'error'], null);
      break;
    case GRANULE_REINGEST_INFLIGHT:
      set(state, ['reingested', id, 'status'], 'inflight');
      break;
    case GRANULE_REINGEST_ERROR:
      set(state, ['reingested', id, 'status'], 'error');
      set(state, ['reingested', id, 'error'], action.error);
      break;

    case GRANULE_APPLYWORKFLOW:
      set(state, ['executed', id, 'status'], 'success');
      set(state, ['executed', id, 'error'], null);
      break;
    case GRANULE_APPLYWORKFLOW_INFLIGHT:
      set(state, ['executed', id, 'status'], 'inflight');
      break;
    case GRANULE_APPLYWORKFLOW_ERROR:
      set(state, ['executed', id, 'status'], 'error');
      set(state, ['executed', id, 'error'], action.error);
      break;

    case GRANULE_REMOVE:
      set(state, ['removed', id, 'status'], 'success');
      set(state, ['removed', id, 'error'], null);
      break;
    case GRANULE_REMOVE_INFLIGHT:
      set(state, ['removed', id, 'status'], 'inflight');
      break;
    case GRANULE_REMOVE_ERROR:
      set(state, ['removed', id, 'status'], 'error');
      set(state, ['removed', id, 'error'], action.error);
      break;

    case GRANULE_RECOVER:
      set(state, ['recovered', id, 'status'], 'success');
      set(state, ['recovered', id, 'error'], null);
      break;
    case GRANULE_RECOVER_INFLIGHT:
      set(state, ['recovered', id, 'status'], 'inflight');
      break;
    case GRANULE_RECOVER_ERROR:
      set(state, ['recovered', id, 'status'], 'error');
      set(state, ['recovered', id, 'error'], action.error);
      break;

    case GRANULE_DELETE:
      set(state, ['deleted', id, 'status'], 'success');
      set(state, ['deleted', id, 'error'], null);
      break;
    case GRANULE_DELETE_INFLIGHT:
      set(state, ['deleted', id, 'status'], 'inflight');
      break;
    case GRANULE_DELETE_ERROR:
      set(state, ['deleted', id, 'status'], 'error');
      set(state, ['deleted', id, 'error'], action.error);
      break;

    case SEARCH_GRANULES:
      set(state, ['list', 'params', 'prefix'], action.prefix);
      break;
    case CLEAR_GRANULES_SEARCH:
      set(state, ['list', 'params', 'prefix'], null);
      break;

    case FILTER_GRANULES:
      set(state, ['list', 'params', action.param.key], action.param.value);
      break;
    case CLEAR_GRANULES_FILTER:
      set(state, ['list', 'params', action.paramKey], null);
      break;

    case OPTIONS_COLLECTIONNAME:
      // Map the list response to an object with key-value pairs like:
      // displayValue: optionElementValue
      const options = data.results.reduce((obj, d) => {
        const { name, version } = d;
        obj[`${name} ${version}`] = `${name}___${version}`;
        return obj;
      }, {});
      set(state, ['dropdowns', 'collectionName', 'options'], options);
      break;
    case OPTIONS_COLLECTIONNAME_INFLIGHT:
      break;
    case OPTIONS_COLLECTIONNAME_ERROR:
      set(state, ['dropdowns', 'collectionName', 'options'], []);
      set(state, ['list', 'error'], action.error);
      break;
  }
  return state;
}
