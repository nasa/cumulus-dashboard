'use strict';
import assignDate from './assign-date';
import { set } from 'object-path';

import {
  STATS,
  STATS_INFLIGHT,
  STATS_ERROR,

  COUNT,
  COUNT_INFLIGHT,
  COUNT_ERROR
} from '../actions/types';
import { createReducer } from '@reduxjs/toolkit';

export const initialState = {
  stats: {
    data: {
      collections: {},
      ec2: {},
      errors: {},
      granules: {},
      processingTime: {},
      queues: {},
      storage: {}
    },
    inflight: false,
    error: null
  },
  count: {
    data: {},
    inflight: false,
    error: null
  }
};

export default createReducer(initialState, {

  [STATS]: (state, action) => {
    const stats = { data: assignDate(action.data), inflight: false, error: null };
    state = Object.assign({}, state, { stats });
  },
  [STATS_INFLIGHT]: (state, action) => {
    const stats = { data: state.stats.data, inflight: true, error: state.stats.error };
    state = Object.assign({}, state, { stats });
  },
  [STATS_ERROR]: (state, action) => {
    const stats = { data: state.stats.data, inflight: false, error: action.error };
    state = Object.assign({}, state, { stats });
  },

  [COUNT]: (state, action) => {
    const count = Object.assign({}, state.count);
    set(count, ['data', action.config.qs.type], action.data);
    state = Object.assign({}, state, { count });
  },
  [COUNT_INFLIGHT]: (state, action) => {
    const count = { data: state.count.data, inflight: true, error: state.count.error };
    state = Object.assign({}, state, { count });
  },
  [COUNT_ERROR]: (state, action) => {
    const count = { data: state.count.data, inflight: false, error: action.error };
    state = Object.assign({}, state, { count });
  }
});
