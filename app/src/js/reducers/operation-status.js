import { createReducer } from '@reduxjs/toolkit';
import {
  OPERATION,
  OPERATION_INFLIGHT,
  OPERATION_ERROR,
} from '../actions/types';

export const initialState = {
  data: {},
  inflight: false,
  error: false,
  map: {}
};

export default createReducer(initialState, {
  [OPERATION]: (state, action) => {
    const { data } = action;
    state.inflight = false;
    state.error = false;
    state.data = data;

    const { map, ...restOfState } = state;
    state.map[action.id] = restOfState;
  },
  [OPERATION_INFLIGHT]: (state, action) => {
    state.inflight = true;
    state.map[action.id] = { inflight: true };
  },
  [OPERATION_ERROR]: (state, action) => {
    state.inflight = false;
    state.error = action.error;
    state.map[action.id] = {
      inflight: false,
      error: action.error,
    };
  },
});

