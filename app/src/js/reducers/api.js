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
} from '../actions/types';
import { createReducer } from '@reduxjs/toolkit';

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

export default createReducer(initialState, {
  [DELETE_TOKEN]: (state) => {
    set(state, 'tokens.token', null);
    setToken('');
  },
  [LOGIN]: (state) => {
    set(state, 'authenticated', true);
    set(state, 'inflight', false);
  },
  [LOGIN_INFLIGHT]: (state) => {
    set(state, 'inflight', true);
  },
  [LOGIN_ERROR]: (state, action) => {
    set(state, 'error', action.error);
    set(state, 'inflight', false);
    set(state, 'authenticated', false);
  },
  [LOGOUT]: (state) => {
    set(state, 'authenticated', false);
  },
  [REFRESH_TOKEN]: (state, action) => {
    set(state, 'tokens.error', null);
    set(state, 'tokens.inflight', false);
    set(state, 'tokens.token', action.token);
    setToken(action.token);
  },
  [REFRESH_TOKEN_ERROR]: (state, action) => {
    set(state, 'tokens.error', action.error);
    set(state, 'tokens.inflight', false);
  },
  [REFRESH_TOKEN_INFLIGHT]: (state) => {
    set(state, 'tokens.inflight', true);
  },
  [SET_TOKEN]: (state, action) => {
    set(state, 'tokens.token', action.token);
    setToken(action.token);
  }
});
