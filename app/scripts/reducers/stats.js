'use strict';
import assignDate from './assign-date';

import {
  STATS
} from '../actions';

export const initialState = {
  collections: {},
  ec2: {},
  errors: {},
  granules: {},
  processingTime: {},
  queues: {},
  storage: {}
};

export default function reducer (state = initialState, action) {
  let nextState;
  switch (action.type) {
    case STATS:
      nextState = Object.assign(state, assignDate(action.data));
      break;
  }
  return nextState || state;
}
