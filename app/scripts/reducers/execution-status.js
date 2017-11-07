'use strict';
import { set } from 'object-path';

import {
  EXECUTION_STATUS,
  EXECUTION_STATUS_INFLIGHT,
  EXECUTION_STATUS_ERROR
} from '../actions';

export const initialState = {
  execution: null,
  executionHistory: null,
  stateMachine: null,
  inflight: false,
  error: false,
  meta: {}
};

export default function reducer (state = initialState, action) {
  state = Object.assign({}, state);
  const { data } = action;

  switch (action.type) {
    case EXECUTION_STATUS:
      set(state, ['inflight'], false);
      set(state, ['error'], false);
      set(state, ['execution'], data.execution);
      set(state, ['executionHistory'], data.executionHistory);
      set(state, ['stateMachine'], data.stateMachine);
      break;
    case EXECUTION_STATUS_INFLIGHT:
      set(state, ['inflight'], true);
      break;
    case EXECUTION_STATUS_ERROR:
      set(state, ['inflight'], false);
      set(state, ['error'], action.error);
      break;
  }
  return state;
}
