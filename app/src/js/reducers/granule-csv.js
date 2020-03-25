'use strict';

import {
  GRANULE_CSV,
  GRANULE_CSV_INFLIGHT,
  GRANULE_CSV_ERROR
} from '../actions/types';
import { createReducer } from '@reduxjs/toolkit';

export const initialState = {
  data: null,
  inflight: false,
  error: null
};

export default createReducer(initialState, {
  [GRANULE_CSV]: (state, action) => {
    return { ...state, data: action.data, inflight: false, error: null };
  },
  [GRANULE_CSV_INFLIGHT]: (state) => {
    return { ...state, inflight: true, error: state.error };
  },
  [GRANULE_CSV_ERROR]: (state, action) => {
    return { ...state, inflight: false, error: action.error };
  }
});
