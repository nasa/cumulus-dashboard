'use strict';
import { get, set } from 'object-path';

import {
  validateCollection
} from '../utils/model';

import * as ids from '../utils/ids';

import {
  AUTHENTICATED,
  LIST_COLLECTIONS,
  GET_COLLECTION
} from '../actions';

export const initialState = {
  authenticated: true,
  collections: [],
  collectionDetail: {}
};

export default function reducer (state = initialState, action) {
  state = Object.assign({}, state);
  switch (action.type) {
    case AUTHENTICATED:
      set(state, 'authenticated', action.data);
      break;
    case LIST_COLLECTIONS:
      action.data.forEach(validateCollection);
      set(state, 'collections', action.data);
      break;
    case GET_COLLECTION:
      validateCollection(action.data);
      set(state, ['collectionDetail', get(action.data, ids.collection)], action.data);
      break;
  }
  return state;
}
