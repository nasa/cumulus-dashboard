'use strict';
import { get, set } from 'object-path';

import * as ids from '../utils/ids';

import {
  AUTHENTICATED,
  LIST_COLLECTIONS,
  GET_COLLECTION,
  POST_COLLECTION,
  LIST_GRANULES
} from '../actions';

export const initialState = {
  authenticated: true,
  collections: [],
  collectionDetail: {},
  postedCollections: {},
  granules: []
};

export default function reducer (state = initialState, action) {
  state = Object.assign({}, state);
  switch (action.type) {
    case AUTHENTICATED:
      set(state, 'authenticated', action.data);
      break;
    case LIST_COLLECTIONS:
      set(state, 'collections', action.data);
      break;
    case GET_COLLECTION:
      set(state, ['collectionDetail', get(action.data, ids.collection)], action.data);
      break;
    case POST_COLLECTION:
      set(state, ['postedCollections', action.postType, action.key], action.data);
      break;
    case LIST_GRANULES:
      set(state, 'granules', action.data);
      break;
  }
  return state;
}
