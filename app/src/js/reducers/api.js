'use strict';

import { get as getToken, set as setToken } from '../utils/auth';
import { createReducer } from '@reduxjs/toolkit';
import {
  DELETE_TOKEN,
  LOGIN,
  LOGIN_ERROR,
  LOGIN_INFLIGHT,
  LOGOUT,
  REFRESH_TOKEN,
  REFRESH_TOKEN_ERROR,
  REFRESH_TOKEN_INFLIGHT,
  SET_TOKEN
} from '../actions/types';

export const initialState = {
  authenticated: getToken() != null,
  inflight: false,
  error: null,
  tokens: {
    error: null,
    inflight: false,
    token: getToken()
  }
};

export default createReducer(initialState, {
  [DELETE_TOKEN]: ({ tokens }) => {
    setToken('');
    tokens.token = null;
  },
  [LOGIN]: (draftState) => {
    draftState.authenticated = true;
    draftState.inflight = false;
  },
  [LOGIN_ERROR]: (draftState, { error }) => {
    draftState.error = error;
    draftState.inflight = false;
    draftState.authenticated = false;
  },
  [LOGIN_INFLIGHT]: (draftState) => {
    draftState.inflight = true;
  },
  [LOGOUT]: (draftState) => {
    draftState.authenticated = false;
  },
  [REFRESH_TOKEN]: ({ tokens }, { token }) => {
    setToken(tokens.token = token);
    tokens.error = null;
    tokens.inflight = false;
  },
  [REFRESH_TOKEN_ERROR]: ({ tokens }, { error }) => {
    tokens.error = error;
    tokens.inflight = false;
  },
  [REFRESH_TOKEN_INFLIGHT]: ({ tokens }) => {
    tokens.inflight = true;
  },
  [SET_TOKEN]: ({ tokens }, { token }) => {
    setToken(tokens.token = token);
  },
});
