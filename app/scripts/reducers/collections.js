'use strict';
import { set } from 'object-path';

import {
  LIST_COLLECTIONS,
  QUERY_COLLECTION,
  GET_COLLECTION,
  POST_COLLECTION
} from '../actions';

export const initialState = {
  list: [],
  map: {},
  created: {}
};

export default function reducer (state = initialState, action) {
  state = Object.assign({}, state);
  switch (action.type) {
    case LIST_COLLECTIONS:
      set(state, 'list', action.data);
      // also sync each collection into the collection map
      const map = {};
      action.data.forEach(d => {
        map[d.collectionName] = d;
      });
      Object.assign(state.map, map);
      break;

    case QUERY_COLLECTION:
      set(state, ['map', action.data.collectionName], {
        inflight: true
      });
      break;

    case GET_COLLECTION:
      set(state, ['map', action.data.collectionName], {
        inflight: false,
        data: action.data
      });
      break;

    case POST_COLLECTION:
      set(state, ['created', action.postType, action.key], action.data);
      break;
  }
  return state;
}
