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
  searchString: null,
  map: {},
};

function createMap (data) {
  const map = {};
  data.forEach(d => {
    map[d.name] = d;
  });
  return map;
}

/**
 * Filters intput data by filterstring on the data'a object's name.
*
 * @param {Array} rawData - An array of objects with a name parameter.
 * @param {string} filterString - a string to check if name includes.
 * @returns {Array} Filtered Array of rawData's objects who's names include filterString.
 */
export const filterData = (rawData, filterString) => {
  if (filterString !== null) {
    return rawData.filter(d => d.name.toLowerCase().includes(filterString.toLowerCase()));
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
