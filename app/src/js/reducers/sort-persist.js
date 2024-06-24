// import { createReducer } from '@reduxjs/toolkit';
import * as toolkitRaw from '@reduxjs/toolkit';
const { createReducer } = toolkitRaw.default ?? toolkitRaw;
import {
  SORTS,
} from '../actions/types.js';

export const initialState = {
  granulesTable: [],
};
export default createReducer(initialState, {
  [SORTS]: (state, action) => {
    state[action.tableId] = action.sortBy;
  },
});
