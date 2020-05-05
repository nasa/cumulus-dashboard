'use strict';
import { set } from 'object-path';
import { getCollectionId } from '../utils/format';

import {
  ADD_MMTLINK
} from '../actions/types';
import { createReducer } from '@reduxjs/toolkit';

const initialState = {};

export default createReducer(initialState, {
  [ADD_MMTLINK]: (state, action) => {
    const { data } = action;
    const collectionId = getCollectionId(data);
    set(state, [collectionId], data.url);
  },
});
