import { createReducer } from '@reduxjs/toolkit';
import {
  WORKFLOWS_FROM_GRANULES,
  WORKFLOWS_FROM_GRANULES_INFLIGHT,
  WORKFLOWS_FROM_GRANULES_ERROR,
  WORKFLOWS_FROM_GRANULES_CLEAR_ERROR,
  CLEAR_WORKFLOWS_FROM_GRANULES,
} from '../actions/types.js';

export const initialState = {
  workflows: {
    data: [],
  },
  inflight: false,
  error: false,
  meta: {},
};

export default createReducer(initialState, (builder) => {
  builder
    .addCase(WORKFLOWS_FROM_GRANULES, (state, action) => {
      state.workflows.data = action.data;
      state.workflows.inflight = false;
    })
    .addCase(WORKFLOWS_FROM_GRANULES_INFLIGHT, (state) => {
      state.workflows.inflight = true;
    })
    .addCase(WORKFLOWS_FROM_GRANULES_ERROR, (state, action) => {
      state.workflows.inflight = false;
      state.workflows.error = action.error;
    })
    .addCase(WORKFLOWS_FROM_GRANULES_CLEAR_ERROR, (state) => {
      delete state.workflows.error;
    })
    .addCase(CLEAR_WORKFLOWS_FROM_GRANULES, (state) => {
      state.workflows.data = [];
    });
});
