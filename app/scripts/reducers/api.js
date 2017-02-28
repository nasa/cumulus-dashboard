'use strict';
import { set } from 'object-path';

import {
  AUTHENTICATED
} from '../actions';

export const initialState = {
  authenticated: true
};

export default function reducer (state = initialState, action) {
  state = Object.assign({}, state);
  switch (action.type) {
    case AUTHENTICATED:
      set(state, 'authenticated', action.data);
      break;
  }
  return state;
}
