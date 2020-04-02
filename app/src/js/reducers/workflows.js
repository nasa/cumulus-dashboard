'use strict';
import { set } from 'object-path';
import {
  WORKFLOWS,
  WORKFLOWS_INFLIGHT,
  WORKFLOWS_ERROR,
  SEARCH_WORKFLOWS,
  CLEAR_WORKFLOWS_SEARCH
} from '../actions/types';
import { createReducer } from '@reduxjs/toolkit';

export const initialState = {
  data: [],
  meta: {},
  inflight: false,
  error: false,
  searchString: null
};

function createMap (data) {
  const map = {};
  data.forEach(d => {
    map[d.name] = d;
  });
  return map;
}

export const filterData = (rawData, filterString) => {
  if (filterString !== null) {
    return rawData.filter(d => d.name.includes(filterString));
  }
  return rawData;
};

export default createReducer(initialState, {
  [WORKFLOWS]: (state, action) => {
    const { data: rawData } = action;
    const data = filterData(rawData, state.searchString);
    set(state, 'map', createMap(data));
    set(state, ['data'], data);
    set(state, ['meta'], { queriedAt: Date.now() });
    set(state, ['inflight'], false);
    set(state, ['error'], false);
  },
  [WORKFLOWS_INFLIGHT]: (state) => {
    set(state, ['inflight'], true);
  },
  [WORKFLOWS_ERROR]: (state, action) => {
    set(state, ['inflight'], false);
    set(state, ['error'], action.error);
  },
  [SEARCH_WORKFLOWS]: (state, action) => {
    set(state, ['searchString'], action.searchString);
  },
  [CLEAR_WORKFLOWS_SEARCH]: (state) => {
    set(state, ['searchString'], null);
  },
});
