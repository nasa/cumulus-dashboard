import { createReducer } from '@reduxjs/toolkit';
import { SCHEMA } from '../actions/types';

export const initialState = {};

export default createReducer(initialState, {
  [SCHEMA]: (state, action) => {
    state[key(action.config.url)] = action.data;
  }
});

// sample config url is `{rootUrl}/schema/{type}`
const key = (url) => url.substr(url.lastIndexOf('/') + 1);
