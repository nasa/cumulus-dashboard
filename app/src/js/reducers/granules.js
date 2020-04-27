'use strict';

import assignDate from './utils/assign-date';
import removeDeleted from './utils/remove-deleted';
import { createReducer } from '@reduxjs/toolkit';
import { getCollectionId } from '../utils/format';
import {
  createErrorReducer,
  createInflightReducer,
  createSuccessReducer,
} from './utils/reducer-creators';

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
  OPTIONS_COLLECTIONNAME_ERROR,
} from '../actions/types';

export const initialState = {
  list: {
    data: [],
    meta: {},
    params: {},
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
  recent: {},
};

const getConfigRequestId = ({ config: { requestId } }) => requestId;

export default createReducer(initialState, {
  [GRANULE]: ({ map, deleted }, { id, data }) => {
    map[id] = { data: assignDate(data) };
    delete deleted[id];
  },
  [GRANULE_INFLIGHT]: ({ map }, { id }) => {
    map[id] = { inflight: true };
  },
  [GRANULE_ERROR]: ({ map }, { id, error }) => {
    map[id] = { error };
  },
  [GRANULES]: (draftState, { data }) => {
    draftState.list = {
      data: removeDeleted('granuleId', data.results, draftState.deleted),
      meta: assignDate(data.meta),
      params: {},
    };
  },
  [GRANULES_INFLIGHT]: ({ list }) => {
    list.inflight = true;
  },
  [GRANULES_ERROR]: ({ list }, { error }) => {
    list.inflight = false;
    list.error = error;
  },

  [GRANULE_REPROCESS]: createSuccessReducer('reprocessed'),
  [GRANULE_REPROCESS_INFLIGHT]: createInflightReducer('reprocessed'),
  [GRANULE_REPROCESS_ERROR]: createErrorReducer('reprocessed'),
  [GRANULE_REINGEST]: createSuccessReducer('reingested'),
  [GRANULE_REINGEST_INFLIGHT]: createInflightReducer('reingested'),
  [GRANULE_REINGEST_ERROR]: createErrorReducer('reingested'),
  [GRANULE_APPLYWORKFLOW]: createSuccessReducer('executed'),
  [GRANULE_APPLYWORKFLOW_INFLIGHT]: createInflightReducer('executed'),
  [GRANULE_APPLYWORKFLOW_ERROR]: createErrorReducer('executed'),
  [GRANULE_REMOVE]: createSuccessReducer('removed'),
  [GRANULE_REMOVE_INFLIGHT]: createInflightReducer('removed'),
  [GRANULE_REMOVE_ERROR]: createErrorReducer('removed'),
  [BULK_GRANULE]: createSuccessReducer('bulk', getConfigRequestId),
  [BULK_GRANULE_INFLIGHT]: createInflightReducer('bulk', getConfigRequestId),
  [BULK_GRANULE_ERROR]: createErrorReducer('bulk', getConfigRequestId),
  [GRANULE_DELETE]: createSuccessReducer('deleted'),
  [GRANULE_DELETE_INFLIGHT]: createInflightReducer('deleted'),
  [GRANULE_DELETE_ERROR]: createErrorReducer('deleted'),

  [SEARCH_GRANULES]: ({ list }, { prefix }) => {
    list.params.prefix = prefix;
  },
  [CLEAR_GRANULES_SEARCH]: ({ list }) => {
    delete list.params.prefix;
  },
  [FILTER_GRANULES]: ({ list }, { param }) => {
    list.params[param.key] = param.value;
  },
  [CLEAR_GRANULES_FILTER]: ({ list }, { paramKey }) => {
    delete list.params[paramKey];
  },
  [OPTIONS_COLLECTIONNAME]: ({ dropdowns }, { data }) => {
    const options = data.results.reduce(
      (obj, { name, version }) =>
        Object.assign(obj, {
          [`${name} ${version}`]: getCollectionId({ name, version }),
        }),
      {}
    );
    dropdowns.collectionName = { options };
  },
  [OPTIONS_COLLECTIONNAME_INFLIGHT]: () => {},
  [OPTIONS_COLLECTIONNAME_ERROR]: ({ dropdowns, list }, { error }) => {
    delete dropdowns.collectionName;
    list.error = error;
  },
});
