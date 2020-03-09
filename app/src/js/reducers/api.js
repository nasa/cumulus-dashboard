'use strict';
import { set } from 'object-path';
import { get as getToken, set as setToken } from '../utils/auth';
import clonedeep from 'lodash.clonedeep';

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
} from '../actions/types';

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
  let newState = null;
  switch (action.type) {
    case DELETE_TOKEN:
      newState = clonedeep(state);
      set(newState, 'tokens.token', null);
      setToken('');
      break;
    case LOGIN:
      newState = {...state};
      set(newState, 'authenticated', true);
      set(newState, 'inflight', false);
      break;
    case LOGIN_INFLIGHT:
      newState = {...state};
      set(newState, 'inflight', true);
      break;
    case LOGIN_ERROR:
      newState = {...state};
      set(newState, 'error', action.error);
      set(newState, 'inflight', false);
      set(newState, 'authenticated', false);
      break;
    case LOGOUT:
      newState = {...state};
      set(newState, 'authenticated', false);
      break;
    case REFRESH_TOKEN:
      newState = clonedeep(state);
      set(newState, 'tokens.error', null);
      set(newState, 'tokens.inflight', false);
      set(newState, 'tokens.token', action.token);
      setToken(action.token);
      break;
    case REFRESH_TOKEN_ERROR:
      newState = clonedeep(state);
      set(newState, 'tokens.error', action.error);
      set(newState, 'tokens.inflight', false);
      break;
    case REFRESH_TOKEN_INFLIGHT:
      newState = clonedeep(state);
      set(newState, 'tokens.inflight', true);
      break;
    case SET_TOKEN:
      newState = clonedeep(state);
      set(newState, 'tokens.token', action.token);
      setToken(action.token);
      break;
  }
  return newState || state;
}
