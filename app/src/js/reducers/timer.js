import { createReducer } from '@reduxjs/toolkit';
import { TIMER_START, TIMER_STOP, TIMER_SET_COUNTDOWN } from '../actions/types';

export const initialState = {
  running: false,
  seconds: -1,
};

export default createReducer(initialState, {
  [TIMER_STOP]: (state, action) => {
    state.running = false;
    state.seconds = -1;
  },
  [TIMER_START]: (state, action) => {
    state.running = true;
    state.seconds = action.secondsToRefresh;
  },
  [TIMER_SET_COUNTDOWN]: (state, action) => {
    state.seconds = action.secondsToRefresh;
  },
});
