'use strict';

import get from 'lodash.get';
import { set } from 'object-path';
import assignDate from './assign-date';

import {
  DIST,
  DIST_INFLIGHT,
  DIST_ERROR,
  DIST_APIGATEWAY,
  DIST_APIGATEWAY_INFLIGHT,
  DIST_APIGATEWAY_ERROR
} from '../actions/types';

const initialState = {
  apiGateway: {
    execution: {
      errors: {},
      successes: {}
    },
    access: {
      errors: {},
      successes: {}
    }
  },
  s3Access: {
    errors: {},
    successes: {}
  },
  data: {
    errors: {},
    successes: {}
  }
};


const pluckValuesFromData = (data, name) => {
  return get(data, `aggregations.2.buckets.${name}.doc_count`, null);
}

export default function reducer (state = initialState, action) {

  state = Object.assign({}, state);
  switch (action.type) {
    case DIST:
      set(state, 'data', assignDate(action.data));
      set(state, 'error', null);
      set(state, 'inflight', false);
      break;
    case DIST_INFLIGHT:
      set(state, 'inflight', true);
      break;
    case DIST_ERROR:
      set(state, 'inflight', false);
      set(state, 'error', action.error);
      break;
    case DIST_APIGATEWAY:
      set(state, 'apiGateway.error', null);
      set(state, 'apiGateway.inflight', false);
      set(state, 'apiGateway.queriedAt', new Date(Date.now()));
      set(state, 'apiGateway.access.errors', pluckValuesFromData(action.data, 'ApiAccessErrors'));
      set(state, 'apiGateway.access.successes', pluckValuesFromData(action.data, 'ApiAccessSuccesses'));
      set(state, 'apiGateway.execution.errors', pluckValuesFromData(action.data, 'ApiExecutionErrors'));
      set(state, 'apiGateway.execution.successes', pluckValuesFromData(action.data, 'ApiExecutionSuccesses'));
      break;
  }

  return state;
}
