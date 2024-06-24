// import { createReducer } from '@reduxjs/toolkit';
import * as toolkitRaw from '@reduxjs/toolkit';
const { createReducer } = toolkitRaw.default ?? toolkitRaw;
import { SCHEMA } from '../actions/types.js';

export const initialState = {};

export default createReducer(initialState, {
  [SCHEMA]: (state, action) => {
    state[key(action.config.url)] = action.data;
  }
});

// sample config url is `{rootUrl}/schema/{type}`
const key = (url) => url.substr(url.lastIndexOf('/') + 1);
