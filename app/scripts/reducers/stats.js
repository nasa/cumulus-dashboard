'use strict';
import assignDate from './assign-date';

import {
  STATS,
  STATS_INFLIGHT,
  STATS_ERROR
} from '../actions';

export const initialState = {
  stats: {
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
};

export default function reducer (state = initialState, action) {
  let nextState;
  switch (action.type) {
    case STATS:
      nextState = { stats: assignDate(action.data), inflight: false, error: null };
      break;
    case STATS_INFLIGHT:
      nextState = { stats: state.data, inflight: true, error: state.error };
      break;
    case STATS_ERROR:
      nextState = { stats: state.data, inflight: false, error: action.error };
      break;
  }
  return nextState || state;
}
