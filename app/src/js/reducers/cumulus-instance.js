'use strict';

import { createReducer } from '@reduxjs/toolkit';
import { ADD_INSTANCE_META } from '../actions/types';

export const initialState = {};

export default createReducer(initialState, {
  [ADD_INSTANCE_META]: (draftState, { data: { cmr = {}, cumulus = {} } }) => {
    if (cmr.environment) draftState.cmrEnvironment = cmr.environment;
    if (cmr.provider) draftState.cmrProvider = cmr.provider;
    if (cumulus.stackName) draftState.stackName = cumulus.stackName;
  }
});
