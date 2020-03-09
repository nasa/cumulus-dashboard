'use strict';

import {get} from 'object-path';
import {ADD_INSTANCE_META} from '../actions/types';
// In Node 12.0.0+, use built-in Object.fromEntries instead of fromPairs
import fromPairs from 'lodash.frompairs';
import cloneDeep from 'lodash.clonedeep';

export const initialState = {};

export default function reducer (state = initialState, action) {
  let newState = null;
  const { data } = action;
  if (action.type === ADD_INSTANCE_META) {
    newState = cloneDeep(state);
    newState = {
      ...state,
      ...fromPairs([
        ['cmrEnvironment', get(data, 'cmr.environment')],
        ['cmrProvider', get(data, 'cmr.provider')],
        ['stackName', get(data, 'cumulus.stackName')]
      ].filter(([_, value]) => value))
    };
  }

  return newState || state;
}
