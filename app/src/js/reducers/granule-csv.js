'use strict';

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
  [GRANULE_CSV]: (draftState, { data }) => {
    draftState.data = data;
    draftState.inflight = false;
    draftState.error = null;
  },
  [GRANULE_CSV_INFLIGHT]: (draftState) => {
    draftState.inflight = true;
  },
  [GRANULE_CSV_ERROR]: (draftState, { error }) => {
    draftState.inflight = false;
    draftState.error = error;
  },
});
