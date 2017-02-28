'use strict';
import { set } from 'object-path';

import {
  LIST_PDRS
} from '../actions';

export const initialState = {
  list: [],
  meta: {}
};

export default function reducer (state = initialState, action) {
  state = Object.assign({}, state);
  switch (action.type) {
    case LIST_PDRS:
      set(state, 'list', action.data.results);
      set(state, 'meta', action.data.meta);
      break;
  }
  return state;
}
