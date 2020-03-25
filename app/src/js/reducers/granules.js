'use strict';
import { set, del } from 'object-path';
import assignDate from './assign-date';
import removeDeleted from './remove-deleted';

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
import { createReducer } from '@reduxjs/toolkit';
import { getCollectionId } from '../utils/format';

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

export default createReducer(initialState, {
  [GRANULE]: (state, action) => {
    const { id, data } = action;
    set(state, ['map', id, 'inflight'], false);
    set(state, ['map', id, 'data'], assignDate(data));
    del(state, ['deleted', id]);
  },
  [GRANULE_INFLIGHT]: (state, action) => {
    const { id } = action;
    set(state, ['map', id, 'inflight'], true);
  },
  [GRANULE_ERROR]: (state, action) => {
    const { id } = action;
    set(state, ['map', id, 'inflight'], false);
    set(state, ['map', id, 'error'], action.error);
  },

  [GRANULES]: (state, action) => {
    const { data } = action;
    set(state, ['list', 'data'], removeDeleted('granuleId', data.results, state.deleted));
    set(state, ['list', 'meta'], assignDate(data.meta));
    set(state, ['list', 'inflight'], false);
    set(state, ['list', 'error'], false);
  },
  [GRANULES_INFLIGHT]: (state, action) => {
    set(state, ['list', 'inflight'], true);
  },
  [GRANULES_ERROR]: (state, action) => {
    set(state, ['list', 'inflight'], false);
    set(state, ['list', 'error'], action.error);
  },

  [GRANULE_REPROCESS]: (state, action) => {
    const { id } = action;
    set(state, ['reprocessed', id, 'status'], 'success');
    set(state, ['reprocessed', id, 'error'], null);
  },
  [GRANULE_REPROCESS_INFLIGHT]: (state, action) => {
    const { id } = action;
    set(state, ['reprocessed', id, 'status'], 'inflight');
  },
  [GRANULE_REPROCESS_ERROR]: (state, action) => {
    const { id } = action;
    set(state, ['reprocessed', id, 'status'], 'error');
    set(state, ['reprocessed', id, 'error'], action.error);
  },

  [GRANULE_REINGEST]: (state, action) => {
    const { id } = action;
    set(state, ['reingested', id, 'status'], 'success');
    set(state, ['reingested', id, 'error'], null);
  },
  [GRANULE_REINGEST_INFLIGHT]: (state, action) => {
    const { id } = action;
    set(state, ['reingested', id, 'status'], 'inflight');
  },
  [GRANULE_REINGEST_ERROR]: (state, action) => {
    const { id } = action;
    set(state, ['reingested', id, 'status'], 'error');
    set(state, ['reingested', id, 'error'], action.error);
  },

  [GRANULE_APPLYWORKFLOW]: (state, action) => {
    const { id } = action;
    set(state, ['executed', id, 'status'], 'success');
    set(state, ['executed', id, 'error'], null);
  },
  [GRANULE_APPLYWORKFLOW_INFLIGHT]: (state, action) => {
    const { id } = action;
    set(state, ['executed', id, 'status'], 'inflight');
  },
  [GRANULE_APPLYWORKFLOW_ERROR]: (state, action) => {
    const { id } = action;
    set(state, ['executed', id, 'status'], 'error');
    set(state, ['executed', id, 'error'], action.error);
  },

  [GRANULE_REMOVE]: (state, action) => {
    const { id } = action;
    set(state, ['removed', id, 'status'], 'success');
    set(state, ['removed', id, 'error'], null);
  },
  [GRANULE_REMOVE_INFLIGHT]: (state, action) => {
    const { id } = action;
    set(state, ['removed', id, 'status'], 'inflight');
  },
  [GRANULE_REMOVE_ERROR]: (state, action) => {
    const { id } = action;
    set(state, ['removed', id, 'status'], 'error');
    set(state, ['removed', id, 'error'], action.error);
  },

  [BULK_GRANULE]: (state, action) => {
    const { data, config } = action;
    set(state, ['bulk', config.requestId, 'data'], data);
    set(state, ['bulk', config.requestId, 'status'], 'success');
    set(state, ['bulk', config.requestId, 'error'], null);
  },
  [BULK_GRANULE_INFLIGHT]: (state, action) => {
    const { config } = action;
    set(state, ['bulk', config.requestId, 'status'], 'inflight');
  },
  [BULK_GRANULE_ERROR]: (state, action) => {
    const { config } = action;
    set(state, ['bulk', config.requestId, 'status'], 'error');
    set(state, ['bulk', config.requestId, 'error'], action.error);
  },

  [GRANULE_DELETE]: (state, action) => {
    const { id } = action;
    set(state, ['deleted', id, 'status'], 'success');
    set(state, ['deleted', id, 'error'], null);
  },
  [GRANULE_DELETE_INFLIGHT]: (state, action) => {
    const { id } = action;
    set(state, ['deleted', id, 'status'], 'inflight');
  },
  [GRANULE_DELETE_ERROR]: (state, action) => {
    const { id } = action;
    set(state, ['deleted', id, 'status'], 'error');
    set(state, ['deleted', id, 'error'], action.error);
  },

  [SEARCH_GRANULES]: (state, action) => {
    set(state, ['list', 'params', 'prefix'], action.prefix);
  },
  [CLEAR_GRANULES_SEARCH]: (state, action) => {
    set(state, ['list', 'params', 'prefix'], null);
  },

  [FILTER_GRANULES]: (state, action) => {
    set(state, ['list', 'params', action.param.key], action.param.value);
  },
  [CLEAR_GRANULES_FILTER]: (state, action) => {
    set(state, ['list', 'params', action.paramKey], null);
  },

  [OPTIONS_COLLECTIONNAME]: (state, action) => {
    const options = action.data.results.reduce(
      (obj, { name, version }) =>
        Object.assign(obj, {
          [`${name} ${version}`]: getCollectionId({ name, version })
        }),
      {}
    );
    set(state, ['dropdowns', 'collectionName', 'options'], options);
  },
  [OPTIONS_COLLECTIONNAME_INFLIGHT]: () => {},
  [OPTIONS_COLLECTIONNAME_ERROR]: (state, action) => {
    set(state, ['dropdowns', 'collectionName', 'options'], []);
    set(state, ['list', 'error'], action.error);
  }
});
