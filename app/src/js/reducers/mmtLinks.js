'use strict';

import { getCollectionId } from '../utils/format';
import { createReducer } from '@reduxjs/toolkit';
import { ADD_MMTLINK } from '../actions/types';

const initialState = {};

export default createReducer(initialState, {
  [ADD_MMTLINK]: (state, action) => {
    state[getCollectionId(action.data)] = action.data.url;
  },
});
