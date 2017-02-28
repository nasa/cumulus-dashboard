'use strict';

import {
  GET_STATS
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
    case GET_STATS:
      nextState = Object.assign(state, action.data);
      break;
  }
  return nextState || state;
}
