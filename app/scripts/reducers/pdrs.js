'use strict';
import { set } from 'object-path';

import {
  PDRS,
  PDRS_INFLIGHT,
  PDRS_ERROR
} from '../actions';

export const initialState = {
  list: {
    data: []
  },
  meta: {}
};

export default function reducer (state = initialState, action) {
  state = Object.assign({}, state);
  const { data } = action;
  switch (action.type) {
    case PDRS:
      set(state, ['list', 'data'], data.results);
      set(state, ['list', 'meta'], data.meta);
      set(state, ['list', 'inflight'], false);
      break;
    case PDRS_INFLIGHT:
      set(state, ['list', 'inflight'], true);
      break;
    case PDRS_ERROR:
      set(state, ['list', 'inflight'], false);
      set(state, ['list', 'error'], action.error);
      break;
  }
  return state;
}
