import { createReducer } from '@reduxjs/toolkit';
import assignDate from './utils/assign-date';

import {
  RECOVERY_GRANULE,
  RECOVERY_GRANULE_INFLIGHT,
  RECOVERY_GRANULE_ERROR,
} from '../actions/types';

export const initialState = {
  list: {
    data: [],
    meta: {},
    params: {},
  },
  map: {},
};

export default createReducer(initialState, {
  [RECOVERY_GRANULE]: (state, action) => {
    state.map[action.id] = {
      data: assignDate(action.data),
      error: false,
      inflight: false,
    };
  },
  [RECOVERY_GRANULE_INFLIGHT]: (state, action) => {
    state.map[action.id] = { inflight: true };
  },
  [RECOVERY_GRANULE_ERROR]: (state, action) => {
    state.map[action.id] = {
      error: action.error,
      inflight: false,
    };
  },
});
