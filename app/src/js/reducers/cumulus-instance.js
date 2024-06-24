// import { createReducer } from '@reduxjs/toolkit';
import * as toolkitRaw from '@reduxjs/toolkit';
const { createReducer } = toolkitRaw.default ?? toolkitRaw;
import { ADD_INSTANCE_META } from '../actions/types.js';

export const initialState = {};

export default createReducer(initialState, {
  [ADD_INSTANCE_META]: (state, action) => {
    const { cmr = {}, cumulus = {} } = action.data;
    if (cmr.environment) state.cmrEnvironment = cmr.environment;
    if (cmr.provider) state.cmrProvider = cmr.provider;
    if (cumulus.stackName) state.stackName = cumulus.stackName;
  },
});
