'use strict';
import { set } from 'object-path';
import { getCollectionId } from '../utils/format';

import {
  ADD_MMTLINK
} from '../actions/types';

const initialState = {};

export default function reducer (state = initialState, action) {
  let newState;
  const { data } = action;
  switch (action.type) {
    case ADD_MMTLINK:
      newState = {...state};
      const collectionId = getCollectionId(data);
      set(newState, [collectionId], data.url);
      break;
  }
  return newState || state;
}
