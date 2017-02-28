'use strict';
import { set } from 'object-path';

import {
  LIST_GRANULES,
  QUERY_GRANULE,
  GET_GRANULE
} from '../actions';

export const initialState = {
  list: [],
  map: {},
  meta: {}
};

export default function reducer (state = initialState, action) {
  state = Object.assign({}, state);
  switch (action.type) {
    case LIST_GRANULES:
      set(state, 'list', action.data.results);
      set(state, 'meta', action.data.meta);
      const newMap = {};
      action.data.results.forEach(d => {
        newMap[d.granuleId] = {
          inflight: false,
          'data': d
        };
      });
      set(state, 'map', Object.assign({}, state.map, newMap));
      break;

    case QUERY_GRANULE:
      set(state, ['map', action.data.granuleId, 'inflight'], true);
      break;

    case GET_GRANULE:
      set(state, ['map', action.data.granuleId], { inflight: false, data: action.data });
      break;
  }
  return state;
}
