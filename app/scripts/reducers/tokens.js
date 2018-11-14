'use strict';
import { set } from 'object-path';
import { get as getToken, set as setToken } from '../utils/auth';

import {
  REFRESH_TOKEN,
  REFRESH_TOKEN_ERROR,
  REFRESH_TOKEN_INFLIGHT,
  SET_TOKEN
} from '../actions';

export const initialState = {
  inflight: false,
  error: null,
  token: getToken()
};

export default function reducer (state = initialState, action) {
  state = Object.assign({}, state);
  switch (action.type) {
    case REFRESH_TOKEN:
      set(state, 'error', null);
      set(state, 'inflight', false);
      set(state, 'token', action.token);
      setToken(action.token);
      break;
    case REFRESH_TOKEN_ERROR:
      set(state, 'error', action.error);
      set(state, 'inflight', false);
      break;
    case REFRESH_TOKEN_INFLIGHT:
      set(state, 'inflight', true);
      break;
    case SET_TOKEN:
      set(state, 'token', action.token);
      setToken(action.token);
      break;
  }
  return state;
}
