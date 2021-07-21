import { createReducer } from '@reduxjs/toolkit';
import {
  GRANULES_WORKFLOWS,
  GRANULES_WORKFLOWS_INFLIGHT,
  GRANULES_WORKFLOWS_ERROR,
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
    // state.workflows.data = action.data.results;
    state.workflows.data = ['fakeworkflow1', 'fakeworkflow2', 'abc', 'fakeworkflow3', 'fakeworkflow4', 'fakeworkflow5'];
    state.workflows.inflight = false;
    state.workflows.error = false;
    state.workflows.inflight = false;
    state.workflows.error = false;
  },
  [GRANULES_WORKFLOWS_INFLIGHT]: (state) => {
    state.workflows.inflight = true;
  },
  [GRANULES_WORKFLOWS_ERROR]: (state, action) => {
    state.workflows.inflight = false;
    state.workflows.error = action.error;
  },
  [CLEAR_GRANULES_WORKFLOWS]: (state) => {
    state.workflows.data = [];
  },
});
