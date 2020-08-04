import { createReducer } from '@reduxjs/toolkit';
import { get as getToken, set as setToken } from '../utils/auth';
import {
  DELETE_TOKEN,
  LOGIN,
  LOGIN_ERROR,
  LOGIN_INFLIGHT,
  LOGOUT,
  REFRESH_TOKEN,
  REFRESH_TOKEN_ERROR,
  REFRESH_TOKEN_INFLIGHT,
  SET_TOKEN,
} from '../actions/types';

export const initialState = {
  authenticated: getToken() !== null,
  inflight: false,
  error: null,
  tokens: {
    error: null,
    inflight: false,
    token: getToken(),
  },
};

export default createReducer(initialState, {
  [DELETE_TOKEN]: (state) => {
    setToken('');
    state.tokens.token = null;
  },
  [LOGIN]: (state) => {
    state.authenticated = true;
    state.inflight = false;
  },
  [LOGIN_ERROR]: (state, action) => {
    state.error = action.error;
    state.inflight = false;
    state.authenticated = false;
  },
  [LOGIN_INFLIGHT]: (state) => {
    state.inflight = true;
  },
  [LOGOUT]: (state) => {
    state.authenticated = false;
  },
  [REFRESH_TOKEN]: (state, action) => {
    setToken(action.token);
    state.tokens.token = action.token;
    state.tokens.error = null;
    state.tokens.inflight = false;
  },
  [REFRESH_TOKEN_ERROR]: (state, action) => {
    state.tokens.error = action.error;
    state.tokens.inflight = false;
  },
  [REFRESH_TOKEN_INFLIGHT]: (state) => {
    state.tokens.inflight = true;
  },
  [SET_TOKEN]: (state, action) => {
    setToken(action.token);
    state.tokens.token = action.token;
  },
});
