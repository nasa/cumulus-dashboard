import {
  API_VERSION,
  API_VERSION_ERROR,
  API_VERSION_COMPATIBLE,
  API_VERSION_INCOMPATIBLE
} from '../actions/types';

export const initialState = {
  versionNumber: '',
  isCompatible: false,
  warning: ''
};

export default function reducer (state = initialState, action) {
  switch (action.type) {
    case API_VERSION:
      return {
        ...state,
        versionNumber: action.payload.versionNumber,
        warning: ''
      };
    case API_VERSION_ERROR:
      return {
        ...state,
        apiVersion: action.payload.error.message,
        warning: 'Failed to acquire Cumulus API Version'
      };
    case API_VERSION_COMPATIBLE:
      return {
        ...state,
        isCompatible: true,
        warning: ''
      };
    case API_VERSION_INCOMPATIBLE:
      return {
        ...state,
        isCompatible: false,
        warning: action.payload.warning
      };
  }
  return newState || state;
}
