'use strict';
import { set } from 'object-path';
import {
  WORKFLOWS,
  WORKFLOWS_INFLIGHT,
  WORKFLOWS_ERROR
} from '../actions/types';
import { createReducer } from '@reduxjs/toolkit';

export const initialState = {
  list: {
    data: [],
    meta: {},
    params: {},
    inflight: false,
    error: false
  },
  map: {}
};

function createMap (data) {
  const map = {};
  data.forEach(d => {
    map[d.name] = d;
  });
  return map;
}

export default createReducer(initialState, {
  [WORKFLOWS]: (state, action) => {
    const { data } = action;
    set(state, 'map', createMap(data));
    set(state, ['list', 'data'], data);
    set(state, ['list', 'meta'], { queriedAt: new Date() });
    set(state, ['list', 'inflight'], false);
    set(state, ['list', 'error'], false);
  },
  [WORKFLOWS_INFLIGHT]: (state, action) => {
    set(state, ['list', 'inflight'], true);
  },
  [WORKFLOWS_ERROR]: (state, action) => {
    set(state, ['list', 'inflight'], false);
    set(state, ['list', 'error'], action.error);
  }
});
