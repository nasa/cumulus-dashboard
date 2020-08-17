/* eslint-disable import/no-cycle */
import { createReducer } from '@reduxjs/toolkit';
import { getCollectionId } from '../utils/format';
import { ADD_MMTLINK } from '../actions/types';

const initialState = {};

export default createReducer(initialState, {
  [ADD_MMTLINK]: (state, action) => {
    state[getCollectionId(action.data)] = action.data.url;
  },
});
