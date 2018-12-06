import {
  API_VERSION,
  API_VERSION_INFLIGHT,
  API_VERSION_ERROR
} from '../actions';

export const initialState = {
  api_version: ''

};

export default function reducer (state = initialState, action) {
  state = {...state};
  switch (action.type) {
    case API_VERSION:
      state.api_version = action.api_version;
      break;
    case API_VERSION_INFLIGHT:
      break;
    case API_VERSION_ERROR:
      state.api_version = '';
      break;
  }
  return state;
}
