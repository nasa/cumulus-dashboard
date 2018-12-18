'use strict';
import { set } from 'object-path';
import { get as getToken, set as setToken } from '../utils/auth';

import {
  DELETE_TOKEN,
  LOGIN,
  LOGIN_INFLIGHT,
  LOGIN_ERROR,
  LOGOUT,
  REFRESH_TOKEN,
  REFRESH_TOKEN_ERROR,
  REFRESH_TOKEN_INFLIGHT,
  SET_TOKEN
} from '../actions';

export const initialState = {
  authenticated: !!getToken(),
  inflight: false,
  error: null,
  tokens: {
    error: null,
    inflight: false,
    token: getToken()
  }
};

export default function reducer (state = initialState, action) {
  state = Object.assign({}, state);
  switch (action.type) {
    case DELETE_TOKEN:
      set(state, 'tokens.token', null);
      setToken('');
      break;
    case LOGIN:
      set(state, 'authenticated', true);
      set(state, 'inflight', false);
      break;
    case LOGIN_INFLIGHT:
      set(state, 'inflight', true);
      break;
    case LOGIN_ERROR:
      set(state, 'error', action.error);
      set(state, 'inflight', false);
      set(state, 'authenticated', false);
      break;
    case LOGOUT:
      set(state, 'authenticated', false);
      break;
    case REFRESH_TOKEN:
      set(state, 'tokens.error', null);
      set(state, 'tokens.inflight', false);
      set(state, 'tokens.token', action.token);
      setToken(action.token);
      break;
    case REFRESH_TOKEN_ERROR:
      set(state, 'tokens.error', action.error);
      set(state, 'tokens.inflight', false);
      break;
    case REFRESH_TOKEN_INFLIGHT:
      set(state, 'tokens.inflight', true);
      break;
    case SET_TOKEN:
      set(state, 'tokens.token', action.token);
      setToken(action.token);
      break;
  }
  return state;
}
