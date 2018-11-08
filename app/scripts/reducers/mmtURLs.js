'use strict';
import { set } from 'object-path';
import { getCollectionId } from '../utils/format';

import {
  ADD_MMTURL
} from '../actions';

export const initialState = {};

export default function reducer (state = initialState, action) {
  state = Object.assign({}, state);
  const { data } = action;
  switch (action.type) {
  case ADD_MMTURL:
    const collectionId = getCollectionId(data);
    set(state, [collectionId], data.url);
    break;
  }
  return state;
}
