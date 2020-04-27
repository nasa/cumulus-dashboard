'use strict';

import { createReducer } from '@reduxjs/toolkit';
import {
  WORKFLOWS,
  WORKFLOWS_INFLIGHT,
  WORKFLOWS_ERROR,
  SEARCH_WORKFLOWS,
  CLEAR_WORKFLOWS_SEARCH,
} from '../actions/types';

export const initialState = {
  list: {
    data: [],
    meta: {},
    inflight: false,
    error: false,
  },
  map: {},
  searchString: null,
};

const mapByName = (data) =>
  data.reduce((map, datum) => ({ ...map, [datum.name]: datum }), {});

/**
 * Returns all items from specified data array where each item's name property
 * contains the specified filter string, or the original array if no filter
 * string is specified.
 *
 * @param {Array} data - array of objects with a name parameter
 * @param {string} filterString - string to check if name includes
 * @returns {Array} array of data's objects with names that include filterString
 */
export const filterData = (data, filterString) =>
  !filterString
    ? data
    : data.filter(
      (item) =>
        item.name &&
          item.name.toLowerCase().includes(filterString.toLowerCase())
    );

export default createReducer(initialState, {
  [WORKFLOWS]: (draftState, { data }) => {
    const filteredData = filterData(data, draftState.searchString);

    draftState.map = mapByName(filteredData);
    draftState.list.data = filteredData;
    draftState.list.meta = { queriedAt: Date.now() };
    draftState.list.inflight = false;
    draftState.list.error = false;
  },
  [WORKFLOWS_INFLIGHT]: ({ list }) => {
    list.inflight = true;
  },
  [WORKFLOWS_ERROR]: ({ list }, { error }) => {
    list.inflight = false;
    list.error = error;
  },
  [SEARCH_WORKFLOWS]: (draftState, { searchString }) => {
    draftState.searchString = searchString;
  },
  [CLEAR_WORKFLOWS_SEARCH]: (draftState) => {
    draftState.searchString = null;
  },
});
