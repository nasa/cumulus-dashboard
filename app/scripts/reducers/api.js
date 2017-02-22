'use strict';
import { set } from 'object-path';

import {
  AUTHENTICATED,
  LIST_GRANULES
} from '../actions';

export const initialState = {
  authenticated: true,
  granules: {
    results: [],
    meta: {}
  }
};

export default function reducer (state = initialState, action) {
  state = Object.assign({}, state);
  switch (action.type) {
    case AUTHENTICATED:
      set(state, 'authenticated', action.data);
      break;
    case LIST_GRANULES:
      set(state, 'granules', action.data);
      break;
  }
  return state;
}
