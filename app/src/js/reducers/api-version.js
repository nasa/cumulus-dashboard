'use strict';

import { createReducer } from '@reduxjs/toolkit';
import {
  API_VERSION,
  API_VERSION_COMPATIBLE,
  API_VERSION_ERROR,
  API_VERSION_INCOMPATIBLE
} from '../actions/types';

export const initialState = {
  versionNumber: '',
  isCompatible: false,
  warning: ''
};

export default createReducer(initialState, {
  [API_VERSION]: (draftState, { payload }) => {
    draftState.versionNumber = payload.versionNumber;
    draftState.warning = '';
  },
  [API_VERSION_COMPATIBLE]: (draftState) => {
    draftState.isCompatible = true;
    draftState.warning = '';
  },
  [API_VERSION_ERROR]: (draftState, { payload }) => {
    draftState.apiVersion = payload.error.message;
    draftState.warning = 'Failed to acquire Cumulus API Version';
  },
  [API_VERSION_INCOMPATIBLE]: (draftState, { payload }) => {
    draftState.isCompatible = false;
    draftState.warning = payload.warning;
  },
});
