'use strict';
import { set } from 'object-path';
import {
  EXECUTION_LOGS,
  EXECUTION_LOGS_INFLIGHT,
  EXECUTION_LOGS_ERROR
} from '../actions/types';

export const initialState = {
  results: null,
  details: null,
  inflight: false,
  error: false,
  meta: {}
};

export default function reducer (state = initialState, action) {
  let newState = null;
  const { data } = action;
  switch (action.type) {
    case EXECUTION_LOGS:
      newState = {...state};
      set(newState, ['inflight'], false);
      set(newState, ['error'], false);
      set(newState, ['details'], data.meta);
      set(newState, ['results'], data.results);
      break;
    case EXECUTION_LOGS_INFLIGHT:
      newState = {...state};
      set(newState, ['inflight'], true);
      break;
    case EXECUTION_LOGS_ERROR:
      newState = {...state};
      set(newState, ['inflight'], false);
      set(newState, ['error'], action.error);
      break;
  }
  return newState || state;
}
