import { createReducer } from '@reduxjs/toolkit';
import {
  GRANULES_WORKFLOWS,
  GRANULES_WORKFLOWS_INFLIGHT,
  GRANULES_WORKFLOWS_ERROR,
  GRANULES_WORKFLOWS_CLEAR_ERROR,
  CLEAR_GRANULES_WORKFLOWS,
} from '../actions/types';

export const initialState = {
  workflows: {
    data: [],
  },
  inflight: false,
  error: false,
  meta: {},
};

export default createReducer(initialState, {
  [GRANULES_WORKFLOWS]: (state, action) => {
    state.workflows.data = action.data;
    state.workflows.inflight = false;
  },
  [GRANULES_WORKFLOWS_INFLIGHT]: (state) => {
    state.workflows.inflight = true;
  },
  [GRANULES_WORKFLOWS_ERROR]: (state, action) => {
    state.workflows.inflight = false;
    state.workflows.error = action.error;
  },
  [GRANULES_WORKFLOWS_CLEAR_ERROR]: (state) => {
    delete state.workflows.error;
  },
  [CLEAR_GRANULES_WORKFLOWS]: (state) => {
    state.workflows.data = [];
  },
});
