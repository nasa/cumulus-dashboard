import { combineReducers } from 'redux';

export const reducers = {
  def: (state = {}, action) => state
};

export default combineReducers(Object.assign({}, reducers));
