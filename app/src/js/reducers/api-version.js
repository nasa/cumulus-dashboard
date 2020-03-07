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
  let newState = null;
  switch (action.type) {
    case API_VERSION:
      newState = {
        ...state,
        versionNumber: action.payload.versionNumber,
        warning: ''
      };
      break;
    case API_VERSION_ERROR:
      newState = {
        ...state,
        apiVersion: action.payload.error.message,
        warning: 'Failed to acquire Cumulus API Version'
      };
      break;
    case API_VERSION_COMPATIBLE:
      newState = {
        ...state,
        isCompatible: true,
        warning: ''
      };
      break;
    case API_VERSION_INCOMPATIBLE:
      newState = {
        ...state,
        isCompatible: false,
        warning: action.payload.warning
      };
      break;
  }
  return newState || state;
}
