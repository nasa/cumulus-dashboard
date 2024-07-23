import objectPath from 'object-path';
import { createReducer } from '@reduxjs/toolkit';
import assignDate from './utils/assign-date.js';
import removeDeleted from './utils/remove-deleted.js';
import {
  createClearItemReducer,
  createErrorReducer,
  createInflightReducer,
  createSuccessReducer,
} from './utils/reducer-creators.js';

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
} from '../actions/types.js';

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

export default createReducer(initialState, (builder) => {
  builder
    .addCase(GRANULE, (state, action) => {
      state.map[action.id] = {
        inflight: false,
        data: assignDate(action.data),
      };
      delete state.deleted[action.id];
    })
    .addCase(GRANULE_INFLIGHT, (state, action) => {
      state.map[action.id] = { inflight: true };
    })
    .addCase(GRANULE_ERROR, (state, action) => {
      state.map[action.id] = {
        inflight: false,
        error: action.error,
      };
    })
    .addCase(GRANULES, (state, action) => {
      state.list = {
        ...state.list,
        data: removeDeleted('granuleId', action.data.results, state.deleted),
        meta: assignDate(action.data.meta),
        inflight: false,
        error: false,
      };
    })
    .addCase(GRANULES_INFLIGHT, (state) => {
      state.list.inflight = true;
    })
    .addCase(GRANULES_ERROR, (state, action) => {
      state.list.inflight = false;
      state.list.error = action.error;
    })
    // Reprocessed
    .addCase(GRANULE_REPROCESS, createSuccessReducer('reprocessed'))
    .addCase(GRANULE_REPROCESS_INFLIGHT, createInflightReducer('reprocessed'))
    .addCase(GRANULE_REPROCESS_ERROR, createErrorReducer('reprocessed'))
    // Reingested
    .addCase(GRANULE_REINGEST, createSuccessReducer('reingested'))
    .addCase(GRANULE_REINGEST_INFLIGHT, createInflightReducer('reingested'))
    .addCase(GRANULE_REINGEST_ERROR, createErrorReducer('reingested'))
    .addCase(GRANULE_REINGEST_CLEAR_ERROR, createClearItemReducer('reingested'))
    // Executed
    .addCase(GRANULE_APPLYWORKFLOW, createSuccessReducer('executed'))
    .addCase(GRANULE_APPLYWORKFLOW_INFLIGHT, createInflightReducer('executed'))
    .addCase(GRANULE_APPLYWORKFLOW_ERROR, createErrorReducer('executed'))
    .addCase(
      GRANULE_APPLYWORKFLOW_CLEAR_ERROR,
      createClearItemReducer('executed')
    )
    // Removed
    .addCase(GRANULE_REMOVE, createSuccessReducer('removed'))
    .addCase(GRANULE_REMOVE_INFLIGHT, createInflightReducer('removed'))
    .addCase(GRANULE_REMOVE_ERROR, createErrorReducer('removed'))
    .addCase(GRANULE_REMOVE_CLEAR_ERROR, createClearItemReducer('removed'))
    // Bulk Delete
    .addCase(
      BULK_GRANULE_DELETE,
      createSuccessReducer('bulkDelete', getConfigRequestId)
    )
    .addCase(
      BULK_GRANULE_DELETE_INFLIGHT,
      createInflightReducer('bulkDelete', getConfigRequestId)
    )
    .addCase(
      BULK_GRANULE_DELETE_ERROR,
      createErrorReducer('bulkDelete', getConfigRequestId)
    )
    .addCase(BULK_GRANULE_DELETE_CLEAR_ERROR, (state, action) => {
      const requestId = getRequestId(action);
      objectPath.del(state, ['bulkDelete', requestId, 'error']);
    })
    // Bulk Operations
    .addCase(BULK_GRANULE, createSuccessReducer('bulk', getConfigRequestId))
    .addCase(
      BULK_GRANULE_INFLIGHT,
      createInflightReducer('bulk', getConfigRequestId)
    )
    .addCase(BULK_GRANULE_ERROR, createErrorReducer('bulk', getConfigRequestId))
    .addCase(BULK_GRANULE_CLEAR_ERROR, (state, action) => {
      const requestId = getRequestId(action);
      objectPath.del(state, ['bulk', requestId, 'error']);
    })
    // Bulk Reingest
    .addCase(
      BULK_GRANULE_REINGEST,
      createSuccessReducer('bulkReingest', getConfigRequestId)
    )
    .addCase(
      BULK_GRANULE_REINGEST_INFLIGHT,
      createInflightReducer('bulkReingest', getConfigRequestId)
    )
    .addCase(
      BULK_GRANULE_REINGEST_ERROR,
      createErrorReducer('bulkReingest', getConfigRequestId)
    )
    .addCase(BULK_GRANULE_REINGEST_CLEAR_ERROR, (state, action) => {
      const requestId = getRequestId(action);
      objectPath.del(state, ['bulkReingest', requestId, 'error']);
    })
    // Deleted
    .addCase(GRANULE_DELETE, createSuccessReducer('deleted'))
    .addCase(GRANULE_DELETE_INFLIGHT, createInflightReducer('deleted'))
    .addCase(GRANULE_DELETE_ERROR, createErrorReducer('deleted'))
    .addCase(GRANULE_DELETE_CLEAR_ERROR, createClearItemReducer('deleted'))
    //Search
    .addCase(SEARCH_GRANULES, (state, action) => {
      state.list.params.infix = action.infix;
    })
    .addCase(CLEAR_GRANULES_SEARCH, (state) => {
      state.list.params.infix = null;
    })
    //Filter
    .addCase(FILTER_GRANULES, (state, action) => {
      state.list.params[action.param.key] = action.param.value;
    })
    .addCase(CLEAR_GRANULES_FILTER, (state, action) => {
      state.list.params[action.paramKey] = null;
    })
    // Table Columns
    .addCase(TOGGLE_GRANULES_TABLE_COLUMNS, (state, action) => {
      const recoveryStatus = 'recoveryStatus';
      const { hiddenColumns, allColumns } = action;
      if (
        hiddenColumns.includes(recoveryStatus) &&
        state.list.params.getRecoveryStatus
      ) {
        delete state.list.params.getRecoveryStatus;
      } else if (
        !hiddenColumns.includes(recoveryStatus) &&
        allColumns.includes(recoveryStatus) &&
        state.list.params.getRecoveryStatus !== true
      ) {
        state.list.params.getRecoveryStatus = true;
      }
    });
});
