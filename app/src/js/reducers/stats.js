'use strict';
import assignDate from './assign-date';
import { set } from 'object-path';
import { createReducer } from '@reduxjs/toolkit';
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

export default createReducer(initialState, {
  // These actions' reducers are a bit strange because the createReducer
  // function was not picking up the deep mutation, and because the wrapper
  // thought the underlying state was unchanged (it wasn't) the wrapper
  // returned the original object and the unit tests failed.  cloning the state
  // on entry was a hacky way to force the wrapper to recognize new state in
  // each reducer.  These could be cleaned up, but be sure the tests still pass
  // as they are.
  [STATS]: (state, action) => {
    let newState = cloneDeep(state);
    const stats = { data: assignDate(action.data), inflight: false, error: null };
    newState = Object.assign({}, newState, { stats });
    return newState;
  },
  [STATS_INFLIGHT]: (state) => {
    let newState = cloneDeep(state);
    const stats = { data: newState.stats.data, inflight: true, error: state.stats.error };
    newState = Object.assign({}, newState, { stats });
    return newState;
  },
  [STATS_ERROR]: (state, action) => {
    let newState = cloneDeep(state);
    const stats = { data: newState.stats.data, inflight: false, error: action.error };
    newState = Object.assign({}, newState, { stats });
    return newState;
  },

  [COUNT]: (state, action) => {
    let newState = cloneDeep(state);
    const count = Object.assign({}, newState.count, { inflight: false, error: null });
    set(count, ['data', action.config.qs.type], action.data);
    newState = Object.assign({}, newState, { count });
    return newState;
  },
  [COUNT_INFLIGHT]: (state) => {
    let newState = cloneDeep(state);
    const count = { data: newState.count.data, inflight: true, error: newState.count.error };
    newState = Object.assign({}, newState, { count });
    return newState;
  },
  [COUNT_ERROR]: (state, action) => {
    let newState = cloneDeep(state);
    const count = { data: newState.count.data, inflight: false, error: action.error };
    newState = Object.assign({}, newState, { count });
    return newState;
  }
});
