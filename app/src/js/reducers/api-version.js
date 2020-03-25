import {
  API_VERSION,
  API_VERSION_ERROR,
  API_VERSION_COMPATIBLE,
  API_VERSION_INCOMPATIBLE
} from '../actions/types';
import { createReducer } from '@reduxjs/toolkit';

export const initialState = {
  versionNumber: '',
  isCompatible: false,
  warning: ''
};

export default createReducer(initialState, {

  [API_VERSION]: (state, action) => {
    return {
      ...state,
      versionNumber: action.payload.versionNumber,
      warning: ''
    };
  },
  [API_VERSION_ERROR]: (state, action) => {
    return {
      ...state,
      apiVersion: action.payload.error.message,
      warning: 'Failed to acquire Cumulus API Version'
    };
  },
  [API_VERSION_COMPATIBLE]: (state, action) => {
    return {
      ...state,
      isCompatible: true,
      warning: ''
    };
  },
  [API_VERSION_INCOMPATIBLE]: (state, action) => {
    return {
      ...state,
      isCompatible: false,
      warning: action.payload.warning
    };
  }
});
