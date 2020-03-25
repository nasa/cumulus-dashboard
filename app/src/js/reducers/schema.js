'use strict';

import {
  SCHEMA
} from '../actions/types';
import { createReducer } from '@reduxjs/toolkit';

export const initialState = {};

export default createReducer(initialState, {

  [SCHEMA]: (state, action) => {
    const { config } = action;
    return { ...state, [key(config.url)]: action.data };
  }
});

// sample config url is `{rootUrl}/schema/{type}`
function key (url) {
  const parts = url.split('/');
  return parts[parts.length - 1];
}
