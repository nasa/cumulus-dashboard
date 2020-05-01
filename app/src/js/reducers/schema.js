'use strict';

import { SCHEMA } from '../actions/types';
import { createReducer } from '@reduxjs/toolkit';

export const initialState = {};

export default createReducer(initialState, {
  [SCHEMA]: (state, action) => {
    state[key(action.config.url)] = action.data;
  }
});

// sample config url is `{rootUrl}/schema/{type}`
const key = (url) => url.substr(url.lastIndexOf('/') + 1);
