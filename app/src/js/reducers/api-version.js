import { createReducer } from '@reduxjs/toolkit';
import {
  API_VERSION,
  API_VERSION_COMPATIBLE,
  API_VERSION_ERROR,
  API_VERSION_INCOMPATIBLE,
} from '../actions/types.js';

export const initialState = {
  versionNumber: '',
  isCompatible: false,
  warning: '',
};

export default createReducer(initialState, (builder) => {
  builder
    .addCase(API_VERSION, (state, action) => {
      state.versionNumber = action.payload.versionNumber;
      state.warning = '';
    })
    .addCase(API_VERSION_COMPATIBLE, (state) => {
      state.isCompatible = true;
      state.warning = '';
    })
    .addCase(API_VERSION_ERROR, (state, action) => {
      state.apiVersion = action.payload.error.message;
      state.warning = 'Failed to acquire Cumulus API Version';
    })
    .addCase(API_VERSION_INCOMPATIBLE, (state, action) => {
      state.isCompatible = false;
      state.warning = action.payload.warning;
    });
});
