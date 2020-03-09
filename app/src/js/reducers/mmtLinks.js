'use strict';
import { set } from 'object-path';
import { getCollectionId } from '../utils/format';

import {
  ADD_MMTLINK
} from '../actions/types';

const initialState = {};

export default function reducer (state = initialState, action) {
  let newState = null;
  const { data } = action;
  switch (action.type) {
    case ADD_MMTLINK:
      const collectionId = getCollectionId(data);
      newState = {...state};
      set(newState, [collectionId], data.url);
      break;
  }
  return newState || state;
}
