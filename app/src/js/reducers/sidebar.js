// import { createReducer } from '@reduxjs/toolkit';
import * as toolkitRaw from '@reduxjs/toolkit';
const { createReducer } = toolkitRaw.default ?? toolkitRaw;
import { TOGGLE_SIDEBAR } from '../actions/types.js';

export const initialState = {
  open: true,
};

export default createReducer(initialState, {
  [TOGGLE_SIDEBAR]: (state, action) => {
    state.open = !state.open;
  },
});
