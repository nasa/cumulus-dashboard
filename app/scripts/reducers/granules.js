'use strict';
import { set } from 'object-path';

import {
  LIST_GRANULES
} from '../actions';

export const initialState = {
  granules: {
    results: [],
    meta: {}
  }
};

export default function reducer (state = initialState, action) {
  state = Object.assign({}, state);
  switch (action.type) {
    case LIST_GRANULES:
      set(state, 'granules', action.data);
      break;
  }
  return state;
}
