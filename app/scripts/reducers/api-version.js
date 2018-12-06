import {
  API_VERSION,
  API_VERSION_INFLIGHT,
  API_VERSION_ERROR,
  SET_API_VERSION_COMPAT_ERROR
} from '../actions';

export const initialState = {
  versionNumber: '',
  isCompatible: false
};

export default function reducer (state = initialState, action) {
  state = {...state};
  switch (action.type) {
    case API_VERSION:
      state.apiVersion = action.apiVersion;
      break;
    case SET_API_VERSION_COMPAT_ERROR:
      state.apiIsCompatible = action.payload.isCompatible;
      break;
    case API_VERSION_INFLIGHT:
      break;
    case API_VERSION_ERROR:
      state.apiVersion = '';
      break;
  }
  return state;
}
