'use strict';
import { set } from 'object-path';
import { set as setToken } from '../utils/auth';

import {
  REFRESH_TOKEN,
  REFRESH_TOKEN_ERROR,
  REFRESH_TOKEN_INFLIGHT
} from '../actions';

export const initialState = {
  inflight: false,
  error: null
};

export default function reducer (state = initialState, action) {
  state = Object.assign({}, state);
  switch (action.type) {
    case REFRESH_TOKEN:
      set(state, 'error', null);
      set(state, 'inflight', false);
      setToken(action.token);
      break;
    case REFRESH_TOKEN_ERROR:
      set(state, 'error', action.error);
      set(state, 'inflight', false);
      break;
    case REFRESH_TOKEN_INFLIGHT:
      set(state, 'inflight', true);
      break;
  }
  return state;
}
