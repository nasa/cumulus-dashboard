import { createReducer } from '@reduxjs/toolkit';
import { SORTS } from '../actions/types.js';

export const initialState = {
  granulesTable: [],
};
export default createReducer(initialState, (builder) => {
  builder.addCase(SORTS, (state, action) => {
    state[action.tableId] = action.sortBy;
  });
});
