'use strict';

import {
  SCHEMA
} from '../actions/types';

export const initialState = {};

export default function reducer (state = initialState, action) {
  const { type, config } = action;
  switch (type) {
    case SCHEMA:
      return Object.assign({}, state, { [key(config.url)]: action.data });
    default:
      return state;
  }
}

// sample config url is `{rootUrl}/schema/{type}`
function key (url) {
  const parts = url.split('/');
  return parts[parts.length - 1];
}
