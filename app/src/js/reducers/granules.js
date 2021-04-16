import { del } from 'object-path';
import { createReducer } from '@reduxjs/toolkit';
import assignDate from './utils/assign-date';
import removeDeleted from './utils/remove-deleted';
import {
  createClearItemReducer,
  createErrorReducer,
  createInflightReducer,
  createSuccessReducer
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
  GRANULE_REINGEST_CLEAR_ERROR,
  GRANULE_APPLYWORKFLOW,
  GRANULE_APPLYWORKFLOW_INFLIGHT,
  GRANULE_APPLYWORKFLOW_ERROR,
  GRANULE_APPLYWORKFLOW_CLEAR_ERROR,
  GRANULE_REMOVE,
  GRANULE_REMOVE_INFLIGHT,
  GRANULE_REMOVE_ERROR,
  GRANULE_REMOVE_CLEAR_ERROR,
  BULK_GRANULE,
  BULK_GRANULE_INFLIGHT,
  BULK_GRANULE_ERROR,
  BULK_GRANULE_CLEAR_ERROR,
  BULK_GRANULE_DELETE,
  BULK_GRANULE_DELETE_INFLIGHT,
  BULK_GRANULE_DELETE_ERROR,
  BULK_GRANULE_DELETE_CLEAR_ERROR,
  BULK_GRANULE_REINGEST,
  BULK_GRANULE_REINGEST_INFLIGHT,
  BULK_GRANULE_REINGEST_ERROR,
  BULK_GRANULE_REINGEST_CLEAR_ERROR,
  GRANULE_DELETE,
  GRANULE_DELETE_INFLIGHT,
  GRANULE_DELETE_ERROR,
  GRANULE_DELETE_CLEAR_ERROR,
  SEARCH_GRANULES,
  CLEAR_GRANULES_SEARCH,
  FILTER_GRANULES,
  CLEAR_GRANULES_FILTER,
  TOGGLE_GRANULES_TABLE_COLUMNS,
} from '../actions/types';

export const initialState = {
  list: {
    data: [],
    meta: {},
    params: {},
  },
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
const getRequestId = ({ requestId }) => requestId;

export default createReducer(initialState, {
  [GRANULE]: (state, action) => {
    state.map[action.id] = {
      inflight: false,
      data: assignDate(action.data),
    };
    delete state.deleted[action.id];
  },
  [GRANULE_INFLIGHT]: (state, action) => {
    state.map[action.id] = { inflight: true };
  },
  [GRANULE_ERROR]: (state, action) => {
    state.map[action.id] = {
      inflight: false,
      error: action.error,
    };
  },
  [GRANULES]: (state, action) => {
    state.list = {
      ...state.list,
      data: removeDeleted('granuleId', action.data.results, state.deleted),
      meta: assignDate(action.data.meta),
      inflight: false,
      error: false
    };
  },
  [GRANULES_INFLIGHT]: (state) => {
    state.list.inflight = true;
  },
  [GRANULES_ERROR]: (state, action) => {
    state.list.inflight = false;
    state.list.error = action.error;
  },

  [GRANULE_REPROCESS]: createSuccessReducer('reprocessed'),
  [GRANULE_REPROCESS_INFLIGHT]: createInflightReducer('reprocessed'),
  [GRANULE_REPROCESS_ERROR]: createErrorReducer('reprocessed'),
  [GRANULE_REINGEST]: createSuccessReducer('reingested'),
  [GRANULE_REINGEST_INFLIGHT]: createInflightReducer('reingested'),
  [GRANULE_REINGEST_ERROR]: createErrorReducer('reingested'),
  [GRANULE_REINGEST_CLEAR_ERROR]: createClearItemReducer('reingested'),
  [GRANULE_APPLYWORKFLOW]: createSuccessReducer('executed'),
  [GRANULE_APPLYWORKFLOW_INFLIGHT]: createInflightReducer('executed'),
  [GRANULE_APPLYWORKFLOW_ERROR]: createErrorReducer('executed'),
  [GRANULE_APPLYWORKFLOW_CLEAR_ERROR]: createClearItemReducer('executed'),
  [GRANULE_REMOVE]: createSuccessReducer('removed'),
  [GRANULE_REMOVE_INFLIGHT]: createInflightReducer('removed'),
  [GRANULE_REMOVE_ERROR]: createErrorReducer('removed'),
  [GRANULE_REMOVE_CLEAR_ERROR]: createClearItemReducer('removed'),
  [BULK_GRANULE_DELETE]: createSuccessReducer('bulkDelete', getConfigRequestId),
  [BULK_GRANULE_DELETE_INFLIGHT]: createInflightReducer('bulkDelete', getConfigRequestId),
  [BULK_GRANULE_DELETE_ERROR]: createErrorReducer('bulkDelete', getConfigRequestId),
  [BULK_GRANULE_DELETE_CLEAR_ERROR]: (state, action) => {
    const requestId = getRequestId(action);
    del(state, ['bulkDelete', requestId, 'error']);
  },
  [BULK_GRANULE]: createSuccessReducer('bulk', getConfigRequestId),
  [BULK_GRANULE_INFLIGHT]: createInflightReducer('bulk', getConfigRequestId),
  [BULK_GRANULE_ERROR]: createErrorReducer('bulk', getConfigRequestId),
  [BULK_GRANULE_CLEAR_ERROR]: (state, action) => {
    const requestId = getRequestId(action);
    del(state, ['bulk', requestId, 'error']);
  },
  [BULK_GRANULE_REINGEST]: createSuccessReducer('bulkReingest', getConfigRequestId),
  [BULK_GRANULE_REINGEST_INFLIGHT]: createInflightReducer('bulkReingest', getConfigRequestId),
  [BULK_GRANULE_REINGEST_ERROR]: createErrorReducer('bulkReingest', getConfigRequestId),
  [BULK_GRANULE_REINGEST_CLEAR_ERROR]: (state, action) => {
    const requestId = getRequestId(action);
    del(state, ['bulkReingest', requestId, 'error']);
  },
  [GRANULE_DELETE]: createSuccessReducer('deleted'),
  [GRANULE_DELETE_INFLIGHT]: createInflightReducer('deleted'),
  [GRANULE_DELETE_ERROR]: createErrorReducer('deleted'),
  [GRANULE_DELETE_CLEAR_ERROR]: createClearItemReducer('deleted'),

  [SEARCH_GRANULES]: (state, action) => {
    state.list.params.infix = action.infix;
  },
  [CLEAR_GRANULES_SEARCH]: (state) => {
    state.list.params.infix = null;
  },
  [FILTER_GRANULES]: (state, action) => {
    state.list.params[action.param.key] = action.param.value;
  },
  [CLEAR_GRANULES_FILTER]: (state, action) => {
    state.list.params[action.paramKey] = null;
  },
  [TOGGLE_GRANULES_TABLE_COLUMNS]: (state, action) => {
    const recoveryStatus = 'recoveryStatus';
    const { hiddenColumns, allColumns } = action;
    if (hiddenColumns.includes(recoveryStatus) && state.list.params.getRecoveryStatus) {
      delete state.list.params.getRecoveryStatus;
    } else if (!hiddenColumns.includes(recoveryStatus) &&
      allColumns.includes(recoveryStatus) &&
      state.list.params.getRecoveryStatus !== true) {
      state.list.params.getRecoveryStatus = true;
    }
  }
});
