import { createReducer } from '@reduxjs/toolkit';
import {
  IDLE_TIMER_SHOW_MODAL,
  IDLE_TIMER_LAST_KEY_PRESS,
  // IDLE_TIMER_LOGOUT_TIMER,
} from '../actions/types';

export const initialState = {
  showModal: false,
  lastKeyPress: Date.now(),
  logoutTimer: 300000,
};

export default createReducer(initialState, {
  [IDLE_TIMER_SHOW_MODAL]: (state, action) => {
    state.showModal = !state.showModal;
    // action
  },
  [IDLE_TIMER_LAST_KEY_PRESS]: (state, action) => {
    state.lastKeypress = Date.now();
  },
  // [IDLE_TIMER_LOGOUT_TIMER]: (state, action) => {
  //   state.logoutTimer = logoutTimer;
  // }
});
