'use strict';

import assignDate from './utils/assign-date';
import { createReducer } from '@reduxjs/toolkit';
import {
  STATS,
  STATS_INFLIGHT,
  STATS_ERROR,
  COUNT,
  COUNT_INFLIGHT,
  COUNT_ERROR,
} from '../actions/types';

export const initialState = {
  stats: {
    data: {
      // overview statistics from `/stats`
      collections: {},
      errors: {},
      granules: {},
      processingTime: {},
    },
    inflight: false,
    error: null,
  },
  count: {
    // aggregate stats from /stats/aggregate?type=<type>&field=status
    data: {},
    inflight: false,
    error: null,
  },
};

export default createReducer(initialState, {
  [STATS]: (state, action) => {
    state.stats.data = assignDate(action.data);
    state.stats.inflight = false;
    state.stats.error = null;
  },
  [STATS_INFLIGHT]: (state) => {
    state.stats.inflight = true;
  },
  [STATS_ERROR]: (state, action) => {
    state.stats.inflight = false;
    state.stats.error = action.error;
  },
  [COUNT]: (state, action) => {
    state.count.inflight = false;
    state.count.error = null;
    state.count.data[action.config.qs.type] = action.data;
  },
  [COUNT_INFLIGHT]: (state) => {
    state.count.inflight = true;
  },
  [COUNT_ERROR]: (state, action) => {
    state.count.inflight = false;
    state.count.error = action.error;
  },
});
