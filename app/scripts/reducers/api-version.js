import {
  API_VERSION,
  API_VERSION_ERROR,
  API_VERSION_COMPATIBLE,
  API_VERSION_INCOMPATIBLE
} from '../actions';

export const initialState = {
  versionNumber: '',
  isCompatible: false,
  warning: null
};

export default function reducer (state = initialState, action) {
  state = {...state};
  switch (action.type) {
    case API_VERSION:
      state.apiVersion = action.data.apiVersion;
      state.warning = '';
      break;
    case API_VERSION_ERROR:
      state.apiVersion = action.error.message;
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
