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

export default function reducer (state = initialState, action) {
  let nextState;
  let stats, count;
  switch (action.type) {
    case STATS:
      stats = { data: assignDate(action.data), inflight: false, error: null };
      nextState = Object.assign({}, state, { stats });
      break;
    case STATS_INFLIGHT:
      stats = { data: state.stats.data, inflight: true, error: state.stats.error };
      nextState = Object.assign({}, state, { stats });
      break;
    case STATS_ERROR:
      stats = { data: state.stats.data, inflight: false, error: action.error };
      nextState = Object.assign({}, state, { stats });
      break;

    case COUNT:
      count = Object.assign({}, state.count);
      set(count, ['data', action.config.qs.type], action.data);
      nextState = Object.assign({}, state, { count });
      break;
    case COUNT_INFLIGHT:
      count = { data: state.count.data, inflight: true, error: state.count.error };
      nextState = Object.assign({}, state, { count });
      break;
    case COUNT_ERROR:
      count = { data: state.count.data, inflight: false, error: action.error };
      nextState = Object.assign({}, state, { count });
      break;
  }
  return nextState || state;
}
