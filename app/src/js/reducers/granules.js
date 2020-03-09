'use strict';
import { set, del } from 'object-path';
import assignDate from './assign-date';
import removeDeleted from './remove-deleted';
import cloneDeep from 'lodash.clonedeep';

import {
  GRANULE,
  GRANULE_INFLIGHT,
  GRANULE_ERROR,

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

  BULK_GRANULE,
  BULK_GRANULE_INFLIGHT,
  BULK_GRANULE_ERROR,

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
  recovered: {},
  executed: {},
  deleted: {},
  recent: {}
};

export default function reducer (state = initialState, action) {
  let newState = null;
  const { id, data, config } = action;
  switch (action.type) {
    case GRANULE:
      newState = cloneDeep(state);
      set(newState, ['map', id, 'inflight'], false);
      set(newState, ['map', id, 'data'], assignDate(data));
      del(newState, ['deleted', id]);
      break;
    case GRANULE_INFLIGHT:
      newState = cloneDeep(state);
      set(newState, ['map', id, 'inflight'], true);
      break;
    case GRANULE_ERROR:
      newState = cloneDeep(state);
      set(newState, ['map', id, 'inflight'], false);
      set(newState, ['map', id, 'error'], action.error);
      break;

    case GRANULES:
      newState = cloneDeep(state);
      set(newState, ['list', 'data'], removeDeleted('granuleId', data.results, state.deleted));
      set(newState, ['list', 'meta'], assignDate(data.meta));
      set(newState, ['list', 'inflight'], false);
      set(newState, ['list', 'error'], false);
      break;
    case GRANULES_INFLIGHT:
      newState = cloneDeep(state);
      set(newState, ['list', 'inflight'], true);
      break;
    case GRANULES_ERROR:
      newState = cloneDeep(state);
      set(newState, ['list', 'inflight'], false);
      set(newState, ['list', 'error'], action.error);
      break;
    case GRANULE_REPROCESS:
      newState = cloneDeep(state);
      set(newState, ['reprocessed', id, 'status'], 'success');
      set(newState, ['reprocessed', id, 'error'], null);
      break;
    case GRANULE_REPROCESS_INFLIGHT:
      newState = cloneDeep(state);
      set(newState, ['reprocessed', id, 'status'], 'inflight');
      break;
    case GRANULE_REPROCESS_ERROR:
      newState = cloneDeep(state);
      set(newState, ['reprocessed', id, 'status'], 'error');
      set(newState, ['reprocessed', id, 'error'], action.error);
      break;

    case GRANULE_REINGEST:
      newState = cloneDeep(state);
      set(newState, ['reingested', id, 'status'], 'success');
      set(newState, ['reingested', id, 'error'], null);
      break;
    case GRANULE_REINGEST_INFLIGHT:
      newState = cloneDeep(state);
      set(newState, ['reingested', id, 'status'], 'inflight');
      break;
    case GRANULE_REINGEST_ERROR:
      newState = cloneDeep(state);
      set(newState, ['reingested', id, 'status'], 'error');
      set(newState, ['reingested', id, 'error'], action.error);
      break;

    case GRANULE_APPLYWORKFLOW:
      newState = cloneDeep(state);
      set(newState, ['executed', id, 'status'], 'success');
      set(newState, ['executed', id, 'error'], null);
      break;
    case GRANULE_APPLYWORKFLOW_INFLIGHT:
      newState = cloneDeep(state);
      set(newState, ['executed', id, 'status'], 'inflight');
      break;
    case GRANULE_APPLYWORKFLOW_ERROR:
      newState = cloneDeep(state);
      set(newState, ['executed', id, 'status'], 'error');
      set(newState, ['executed', id, 'error'], action.error);
      break;

    case GRANULE_REMOVE:
      newState = cloneDeep(state);
      set(newState, ['removed', id, 'status'], 'success');
      set(newState, ['removed', id, 'error'], null);
      break;
    case GRANULE_REMOVE_INFLIGHT:
      newState = cloneDeep(state);
      set(newState, ['removed', id, 'status'], 'inflight');
      break;
    case GRANULE_REMOVE_ERROR:
      newState = cloneDeep(state);
      set(newState, ['removed', id, 'status'], 'error');
      set(newState, ['removed', id, 'error'], action.error);
      break;

    case BULK_GRANULE:
      newState = cloneDeep(state);
      set(newState, ['bulk', config.requestId, 'data'], data);
      set(newState, ['bulk', config.requestId, 'status'], 'success');
      set(newState, ['bulk', config.requestId, 'error'], null);
      break;
    case BULK_GRANULE_INFLIGHT:
      newState = cloneDeep(state);
      set(newState, ['bulk', config.requestId, 'status'], 'inflight');
      break;
    case BULK_GRANULE_ERROR:
      newState = cloneDeep(state);
      set(newState, ['bulk', config.requestId, 'status'], 'error');
      set(newState, ['bulk', config.requestId, 'error'], action.error);
      break;

    case GRANULE_DELETE:
      newState = cloneDeep(state);
      set(newState, ['deleted', id, 'status'], 'success');
      set(newState, ['deleted', id, 'error'], null);
      break;
    case GRANULE_DELETE_INFLIGHT:
      newState = cloneDeep(state);
      set(newState, ['deleted', id, 'status'], 'inflight');
      break;
    case GRANULE_DELETE_ERROR:
      newState = cloneDeep(state);
      set(newState, ['deleted', id, 'status'], 'error');
      set(newState, ['deleted', id, 'error'], action.error);
      break;

    case SEARCH_GRANULES:
      newState = cloneDeep(state);
      set(newState, ['list', 'params', 'prefix'], action.prefix);
      break;
    case CLEAR_GRANULES_SEARCH:
      newState = cloneDeep(state);
      set(newState, ['list', 'params', 'prefix'], null);
      break;

    case FILTER_GRANULES:
      newState = cloneDeep(state);
      set(newState, ['list', 'params', action.param.key], action.param.value);
      break;
    case CLEAR_GRANULES_FILTER:
      newState = cloneDeep(state);
      set(newState, ['list', 'params', action.paramKey], null);
      break;

    case OPTIONS_COLLECTIONNAME:
      // Map the list response to an object with key-value pairs like:
      // displayValue: optionElementValue
      newState = cloneDeep(state);
      const options = data.results.reduce((obj, d) => {
        const { name, version } = d;
        obj[`${name} ${version}`] = `${name}___${version}`;
        return obj;
      }, {});
      set(newState, ['dropdowns', 'collectionName', 'options'], options);
      break;
    case OPTIONS_COLLECTIONNAME_INFLIGHT:
      break;
    case OPTIONS_COLLECTIONNAME_ERROR:
      newState = cloneDeep(state);
      set(newState, ['dropdowns', 'collectionName', 'options'], []);
      set(newState, ['list', 'error'], action.error);
      break;
  }
  return newState || state;
}
