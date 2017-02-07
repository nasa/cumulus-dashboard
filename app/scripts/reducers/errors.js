'use strict';
import { get, set } from 'object-path';
import { ERROR } from '../actions';

export const initialState = {
  errors: []
};

export default function reducer (state = initialState, action) {
  state = Object.assign({}, state);
  switch (action.type) {
    case ERROR:
      set(state, 'errors', state.errors.concat([action.data]));
      break;
  }
  return state;
};
