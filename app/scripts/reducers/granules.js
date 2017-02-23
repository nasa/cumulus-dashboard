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
        newMap[id(d)] = d;
      });
      set(state, 'map', Object.assign({}, state.map, newMap));
      break;

    case QUERY_GRANULE:
      set(state, ['map', id(action.data)], { inflight: true });
      break;

    case GET_GRANULE:
      set(state, ['map', id(action.data)], {
        inflight: false,
        data: action.data
      });
      break;
  }
  return state;
}

function id (granule) {
  return `${granule.collectionName}-${granule.granuleId}`;
}
