'use strict';
import { set } from 'object-path';
import {
  EXECUTIONS,
  EXECUTIONS_INFLIGHT,
  EXECUTIONS_ERROR
} from '../actions';

export const initialState = {
  list: {
    data: [],
    meta: {},
    params: {},
    inflight: false,
    error: false
  },
  map: {}
};

export default function reducer (state = initialState, action) {
  state = Object.assign({}, state);
  const { data } = action;
  switch (action.type) {
    case EXECUTIONS:
      set(state, 'list', {
        data: data.results,
        meta: Object.assign({ timestamp: new Date() }, data.meta),
        inflight: false,
        error: false
      });
      break;
    case EXECUTIONS_INFLIGHT:
      set(state, ['list', 'inflight'], true);
      break;
    case EXECUTIONS_ERROR:
      set(state, ['list', 'inflight'], false);
      set(state, ['list', 'error'], action.error);
      break;
  }
  return state;
}
