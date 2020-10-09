import { createReducer } from '@reduxjs/toolkit';
import { TOGGLE_SIDEBAR } from '../actions/types';

export const initialState = {
  open: true,
};

export default createReducer(initialState, {
  [TOGGLE_SIDEBAR]: (state, action) => {
    state.open = !state.open;
  },
});
