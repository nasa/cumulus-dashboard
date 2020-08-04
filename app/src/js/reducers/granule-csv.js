import { createReducer } from '@reduxjs/toolkit';
import {
  GRANULE_CSV,
  GRANULE_CSV_INFLIGHT,
  GRANULE_CSV_ERROR,
} from '../actions/types';

export const initialState = {
  data: null,
  inflight: false,
  error: null,
};

export default createReducer(initialState, {
  [GRANULE_CSV]: (state, action) => {
    state.data = action.data;
    state.inflight = false;
    state.error = null;
  },
  [GRANULE_CSV_INFLIGHT]: (state) => {
    state.inflight = true;
  },
  [GRANULE_CSV_ERROR]: (state, action) => {
    state.inflight = false;
    state.error = action.error;
  },
});
