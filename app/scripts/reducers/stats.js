'use strict';
import assignDate from './assign-date';
import { set } from 'object-path';
import serialize from '../utils/serialize-config';

import {
  STATS,
  STATS_INFLIGHT,
  STATS_ERROR,

  RESOURCES,
  RESOURCES_INFLIGHT,
  RESOURCES_ERROR,

  AGGREGATE,
  AGGREGATE_INFLIGHT,
  AGGREGATE_ERROR,

  HISTOGRAM,
  HISTOGRAM_INFLIGHT,
  HISTOGRAM_ERROR
} from '../actions';

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
  aggregate: {
    data: {},
    inflight: false,
    error: null
  },
  resources: {
    data: {},
    inflight: false,
    error: null
  },
  histogram: {}
};

export default function reducer (state = initialState, action) {
  let nextState;
  let stats, aggregate, resources, histogram;
  switch (action.type) {
    case STATS:
      stats = { data: assignDate(action.data), inflight: false, error: null };
      nextState = Object.assign(state, { stats });
      break;
    case STATS_INFLIGHT:
      stats = { data: state.stats.data, inflight: true, error: state.stats.error };
      nextState = Object.assign(state, { stats });
      break;
    case STATS_ERROR:
      stats = { data: state.stats.data, inflight: false, error: action.error };
      nextState = Object.assign(state, { stats });
      break;

    case AGGREGATE:
      aggregate = Object.assign({}, state.aggregate);
      set(aggregate, ['data', action.config.qs.type], action.data);
      nextState = Object.assign(state, { aggregate });
      break;
    case AGGREGATE_INFLIGHT:
      aggregate = { data: state.aggregate.data, inflight: true, error: state.aggregate.error };
      nextState = Object.assign(state, { aggregate });
      break;
    case AGGREGATE_ERROR:
      aggregate = { data: state.aggregate.data, inflight: false, error: action.error };
      nextState = Object.assign(state, { aggregate });
      break;

    case RESOURCES:
      resources = { data: action.data, inflight: false, error: null };
      nextState = Object.assign(state, { resources });
      break;
    case RESOURCES_INFLIGHT:
      resources = { data: state.resources.data, inflight: true, error: state.resources.error };
      nextState = Object.assign(state, { resources });
      break;
    case RESOURCES_ERROR:
      resources = { data: state.resources.data, inflight: false, error: action.error };
      nextState = Object.assign(state, { resources });
      break;

    case HISTOGRAM:
      histogram = Object.assign({}, state.histogram);
      set(histogram, serialize(action.config.qs), {
        inflight: false,
        data: action.data,
        error: null
      });
      nextState = Object.assign(state, { histogram });
      break;
    case HISTOGRAM_INFLIGHT:
      histogram = Object.assign({}, state.histogram);
      set(histogram, [serialize(action.config.qs), 'inflight'], true);
      nextState = Object.assign(state, { histogram });
      break;
    case HISTOGRAM_ERROR:
      histogram = Object.assign({}, state.histogram);
      set(histogram, [serialize(action.config.qs), 'error'], action.error);
      nextState = Object.assign(state, { histogram });
      break;
  }
  return nextState || state;
}
