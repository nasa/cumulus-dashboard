'use strict';
import { set } from 'object-path';

import {
  LIST_COLLECTIONS,
  QUERY_COLLECTION,
  GET_COLLECTION,
  POST_COLLECTION,
  PUT_COLLECTION
} from '../actions';

export const initialState = {
  list: [],
  map: {},
  created: {}
};

export default function reducer (state = initialState, action) {
  state = Object.assign({}, state);
  switch (action.type) {

    // TODO put each collection in collectionDetail as well.
    case LIST_COLLECTIONS:
      set(state, 'list', action.data);
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

    case PUT_COLLECTION:
      set(state, ['map', action.key, 'data'], action.data.Attributes);
      break;
  }
  return state;
}
