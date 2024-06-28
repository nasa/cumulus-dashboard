import { createReducer } from '@reduxjs/toolkit';
import { TOGGLE_SIDEBAR } from '../actions/types.js';

export const initialState = {
  open: true,
};

export default createReducer(initialState, (builder) => {
  builder
    .addCase(TOGGLE_SIDEBAR, (state, action) => {
      state.open = !state.open;
    });
});
