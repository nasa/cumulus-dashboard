import { createReducer } from '@reduxjs/toolkit';
import {
  CMR_INFO
} from '../actions/types';

export const initialState = {
  cmrEnv: '',
  cmrProvider: '',
  cmrOauthProvider: ''
};

export default createReducer(initialState, {
  [CMR_INFO]: (state, action) => {
    state.cmrEnv = action.data.cmr.environment;
    state.cmrProvider = action.data.cmr.provider;
    state.cmrOauthProvider = action.data.cmr.oauth_provider || '';
  },
});
