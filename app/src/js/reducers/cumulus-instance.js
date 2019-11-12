'use strict';

import {get} from 'object-path';
import {ADD_INSTANCE_META} from '../actions/types';
// In Node 12.0.0+, use built-in Object.fromEntries instead of fromPairs
import fromPairs from 'lodash.frompairs';

export const initialState = {};

export default function reducer (state = initialState, action) {
  const { data } = action;

  if (action.type === ADD_INSTANCE_META) {
    state = {
      ...state,
      ...fromPairs([
        ['cmrEnvironment', get(data, 'cmr.environment')],
        ['cmrProvider', get(data, 'cmr.provider')],
        ['stackName', get(data, 'cumulus.stackName')]
      ].filter(([_, value]) => value))
    };
  }

  return state;
}
