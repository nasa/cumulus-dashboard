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
  searchString: '',
};

const mapByName = (data) => data.reduce((map, datum) => ({ ...map, [datum.name]: datum }), {});

/**
 * Returns all items from specified data array where each item's name property
 * contains the specified filter string, or the original array if no filter
 * string is specified.
 *
 * @param {Array} data - array of objects with a name parameter
 * @param {string} filterString - string to check if name includes
 * @returns {Array} array of data's objects with names that include filterString
 */
export const filterData = (data, filterString = '') => data.filter(
  (item) => item.name &&
    item.name.toLowerCase().includes(filterString.toLowerCase())
);

export default createReducer(initialState, {
  [WORKFLOWS]: (state, action) => {
    const filteredData = filterData(action.data, state.searchString);

    state.map = mapByName(filteredData);
    state.list.data = filteredData;
    state.list.meta = { queriedAt: Date.now() };
    state.list.inflight = false;
    state.list.error = false;
  },
  [WORKFLOWS_INFLIGHT]: (state) => {
    state.list.inflight = true;
  },
  [WORKFLOWS_ERROR]: (state, action) => {
    state.list.inflight = false;
    state.list.error = action.error;
  },
  [SEARCH_WORKFLOWS]: (state, action) => {
    state.searchString = action.searchString;
  },
  [CLEAR_WORKFLOWS_SEARCH]: (state) => {
    state.searchString = '';
  },
});
