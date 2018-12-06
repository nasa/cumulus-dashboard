import {
  API_VERSION,
  API_VERSION_INFLIGHT,
  API_VERSION_ERROR,
  SET_API_VERSION_COMPAT_ERROR
} from '../actions';

export const initialState = {
  api_version: '',
  version_compat_error: false
};

export default function reducer (state = initialState, action) {
  state = {...state};
  switch (action.type) {
    case API_VERSION:
      state.api_version = action.api_version;
      break;
    case SET_API_VERSION_COMPAT_ERROR:
      state.version_compat_error = action.payload.isCompatible;
      break;
    case API_VERSION_INFLIGHT:
      break;
    case API_VERSION_ERROR:
      state.api_version = '';
      break;
  }
  return state;
}
