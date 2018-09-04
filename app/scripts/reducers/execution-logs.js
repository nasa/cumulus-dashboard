'use strict';
import { set } from 'object-path';

import {
  EXECUTION_LOGS,
  EXECUTION_LOGS_INFLIGHT,
  EXECUTION_LOGS_ERROR
} from '../actions';

export const initialState = {
  results: null,
  details: null,
  inflight: false,
  error: false,
  meta: {}
};

export default function reducer (state = initialState, action) {
  state = Object.assign({}, state);
  const { data } = action;
  switch (action.type) {
    case EXECUTION_LOGS:
      set(state, ['inflight'], false);
      set(state, ['error'], false);
      set(state, ['details'], data.meta);
      set(state, ['results'], data.results);
      break;
    case EXECUTION_LOGS_INFLIGHT:
      set(state, ['inflight'], true);
      break;
    case EXECUTION_LOGS_ERROR:
      set(state, ['inflight'], false);
      set(state, ['error'], action.error);
      break;
  }
  return state;
}
