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
  [STATS]: ({ stats }, { data }) => {
    stats.data = assignDate(data);
    stats.inflight = false;
    stats.error = null;
  },
  [STATS_INFLIGHT]: ({ stats }) => {
    stats.inflight = true;
  },
  [STATS_ERROR]: ({ stats }, { error }) => {
    stats.inflight = false;
    stats.error = error;
  },
  [COUNT]: ({ count }, { config, data }) => {
    count.inflight = false;
    count.error = null;
    count.data[config.qs.type] = data;
  },
  [COUNT_INFLIGHT]: ({ count }) => {
    count.inflight = true;
  },
  [COUNT_ERROR]: ({ count }, { error }) => {
    count.inflight = false;
    count.error = error;
  },
});
