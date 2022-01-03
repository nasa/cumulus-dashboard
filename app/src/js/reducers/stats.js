import { createReducer } from '@reduxjs/toolkit';
import assignDate from './utils/assign-date';
import {
  STATS,
  STATS_INFLIGHT,
  STATS_ERROR,
  COUNT,
  COUNT_SIDEBAR,
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
    sidebar: {},
    inflight: false,
    error: null,
  },
};

function shimEmptyCount(count) {
  const completed = count.find((item) => item.key === 'completed') || {
    key: 'completed',
    count: 0,
  };
  const failed = count.find((item) => item.key === 'failed') || {
    key: 'failed',
    count: 0,
  };
  const running = count.find((item) => item.key === 'running') || {
    key: 'running',
    count: 0,
  };
  const queued = count.find((item) => item.key === 'queued') || {
    key: 'queued',
    count: 0,
  };
  return [completed, failed, running, queued];
}

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
    const { count, meta } = action.data;
    const { field } = meta || {};
    const statsCount =
      field === 'status' ? shimEmptyCount(count) : count;
    state.count.inflight = false;
    state.count.error = null;
    state.count.data[action.config.params.type] = {
      ...action.data,
      count: statsCount,
    };
  },
  [COUNT_SIDEBAR]: (state, action) => {
    const { count, meta } = action.data;
    const { field } = meta || {};
    const statsCount =
      field === 'status' ? shimEmptyCount(count) : count;
    state.count.inflight = false;
    state.count.error = null;
    state.count.sidebar[action.config.params.type] = {
      ...action.data,
      count: statsCount,
    };
  },
  [COUNT_INFLIGHT]: (state) => {
    state.count.inflight = true;
  },
  [COUNT_ERROR]: (state, action) => {
    state.count.inflight = false;
    state.count.error = action.error;
  },
});
