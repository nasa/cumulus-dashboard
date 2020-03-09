'use strict';
import { set } from 'object-path';

import {
  EXECUTION_STATUS,
  EXECUTION_STATUS_INFLIGHT,
  EXECUTION_STATUS_ERROR
} from '../actions/types';

export const initialState = {
  execution: null,
  executionHistory: null,
  stateMachine: null,
  inflight: false,
  error: false,
  meta: {}
};

export default function reducer (state = initialState, action) {
  let newState = null;
  const { data } = action;

  switch (action.type) {
    case EXECUTION_STATUS:
      newState = {...state};
      set(newState, ['inflight'], false);
      set(newState, ['error'], false);
      set(newState, ['execution'], data.execution);
      set(newState, ['executionHistory'], data.executionHistory);
      set(newState, ['stateMachine'], data.stateMachine);
      break;
    case EXECUTION_STATUS_INFLIGHT:
      newState = {...state};
      set(newState, ['inflight'], true);
      break;
    case EXECUTION_STATUS_ERROR:
      newState = {...state};
      set(newState, ['inflight'], false);
      set(newState, ['error'], action.error);
      break;
  }
  return newState || state;
}
