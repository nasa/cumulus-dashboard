import { combineReducers } from 'redux';
import api from './api';
import errors from './errors';

export const reducers = {
  def: (state = {}, action) => state,
  api,
  errors
};

export default combineReducers(Object.assign({}, reducers));
