'use strict';
import { set } from 'object-path';

import {
  LOGIN,
  LOGIN_INFLIGHT,
  LOGIN_ERROR,
  LOGOUT
} from '../actions';

export const initialState = {
  authenticated: false,
  inflight: false,
  error: null
};

export default function reducer (state = initialState, action) {
  state = Object.assign({}, state);
  switch (action.type) {
    case LOGIN:
      set(state, 'authenticated', true);
      set(state, 'inflight', false);
      break;
    case LOGIN_INFLIGHT:
      set(state, 'inflight', true);
      break;
    case LOGIN_INFLIGHT:
      set(state, 'error', action.error);
      set(state, 'inflight', false);
      break;
    case LOGOUT:
      set(state, 'authenticated', false);
      break;

  }
  return state;
}
