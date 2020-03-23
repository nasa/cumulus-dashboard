'use strict';
import assignDate from './assign-date';
import { set } from 'object-path';
import cloneDeep from 'lodash.clonedeep';

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
    data: { // overview statistics from `/stats`
      collections: {},
      errors: {},
      granules: {},
      processingTime: {},
    },
    inflight: false,
    error: null
  },
  count: { // aggregate stats from /stats/aggregate?type=<type>&field=status
    data: {},
    inflight: false,
    error: null
  }
};

export default function reducer (state = initialState, action) {
  let nextState = cloneDeep(state);
  let stats, count;
  switch (action.type) {
    case STATS:
      stats = { data: assignDate(action.data), inflight: false, error: null };
      nextState = Object.assign({}, nextState, { stats });
      break;
    case STATS_INFLIGHT:
      stats = { data: nextState.stats.data, inflight: true, error: nextState.stats.error };
      nextState = Object.assign({}, nextState, { stats });
      break;
    case STATS_ERROR:
      stats = { data: nextState.stats.data, inflight: false, error: action.error };
      nextState = Object.assign({}, nextState, { stats });
      break;

    case COUNT:
      count = Object.assign({}, nextState.count, {inflight: false, error: null});
      set(count, ['data', action.config.qs.type], action.data);
      nextState = Object.assign({}, nextState, { count });
      break;
    case COUNT_INFLIGHT:
      count = { data: nextState.count.data, inflight: true, error: nextState.count.error };
      nextState = Object.assign({}, nextState, { count });
      break;
    case COUNT_ERROR:
      count = { data: nextState.count.data, inflight: false, error: action.error };
      nextState = Object.assign({}, nextState, { count });
      break;
  }
  return nextState;
}
