import { combineReducers } from 'redux';
import api from './api';
import collections from './collections';
import granules from './granules';
import errors from './errors';

export const reducers = {
  def: (state = {}, action) => state,
  api,
  collections,
  granules,
  errors
};

export default combineReducers(Object.assign({}, reducers));
