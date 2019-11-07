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
  state = {...state};
  switch (action.type) {
    case API_VERSION:
      state.versionNumber = action.payload.versionNumber;
      state.warning = '';
      break;
    case API_VERSION_ERROR:
      state.apiVersion = action.payload.error.message;
      state.warning = 'Failed to acquire Cumulus API Version';
      break;
    case API_VERSION_COMPATIBLE:
      state.isCompatible = true;
      state.warning = '';
      break;
    case API_VERSION_INCOMPATIBLE:
      state.isCompatible = false;
      state.warning = action.payload.warning;
      break;
  }
  return state;
}
