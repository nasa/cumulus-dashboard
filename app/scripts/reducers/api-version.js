import {
  API_VERSION,
  API_VERSION_ERROR,
  API_VERSION_COMPAT_ERROR
} from '../actions';

export const initialState = {
  versionNumber: '',
  isCompatible: false,
  error: null
};

export default function reducer (state = initialState, action) {
  state = {...state};
  switch (action.type) {
    case API_VERSION:
      state.apiVersion = action.apiVersion;
      break;
    case SET_API_VERSION_COMPAT:
      state.apiIsCompatible = action.payload.isCompatible;
      break;
    case API_VERSION_ERROR:
      state.apiVersion = action.error;
      break;
  }
  return state;
}
