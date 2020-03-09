'use strict';

import {
  GRANULE_CSV,
  GRANULE_CSV_INFLIGHT,
  GRANULE_CSV_ERROR
} from '../actions/types';

export const initialState = {
  data: null,
  inflight: false,
  error: null
};

export default function reducer (state = initialState, action) {
  state = Object.assign({}, state);
  let csvData, nextState;

  switch (action.type) {
    case GRANULE_CSV:
      csvData = { data: action.data, inflight: false, error: null };
      nextState = Object.assign({}, state, csvData);
      break;
    case GRANULE_CSV_INFLIGHT:
      csvData = { data: state.data, inflight: true, error: state.error };
      nextState = Object.assign({}, state, csvData);
      break;
    case GRANULE_CSV_ERROR:
      csvData = { data: state.data, inflight: false, error: action.error };
      nextState = Object.assign({}, state, csvData);
      break;
  }
  return nextState || state;
}
