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
  DIST_APIGATEWAY_ERROR,
  DIST_APILAMBDA,
  DIST_APILAMBDA_INFLIGHT,
  DIST_APILAMBDA_ERROR,
  DIST_S3ACCESS,
  DIST_S3ACCESS_INFLIGHT,
  DIST_S3ACCESS_ERROR
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
  apiLambda: {
    errors: {},
    successes: {}
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

const countsFromApiGatewayData = (data, name) => {
  return get(data, `aggregations.2.buckets.${name}.doc_count`, null);
};

export default function reducer(state = initialState, action) {
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
      set(
        state,
        'apiGateway.access.errors',
        countsFromApiGatewayData(action.data, 'ApiAccessErrors')
      );
      set(
        state,
        'apiGateway.access.successes',
        countsFromApiGatewayData(action.data, 'ApiAccessSuccesses')
      );
      set(
        state,
        'apiGateway.execution.errors',
        countsFromApiGatewayData(action.data, 'ApiExecutionErrors')
      );
      set(
        state,
        'apiGateway.execution.successes',
        countsFromApiGatewayData(action.data, 'ApiExecutionSuccesses')
      );
      break;
    case DIST_APIGATEWAY_INFLIGHT:
      set(state, 'apiGateway.inflight', true);
      break;
    case DIST_APIGATEWAY_ERROR:
      set(state, 'apiGateway.inflight', false);
      set(state, 'apiGateway.error', action.error);
      break;
    case DIST_APILAMBDA:
      set(state, 'apiLambda.error', null);
      set(state, 'apiLambda.inflight', false);
      set(state, 'apiLambda.queriedAt', new Date(Date.now()));
      set(
        state,
        'apiLambda.errors',
        countsFromApiGatewayData(action.data, 'LambdaAPIErrors')
      );
      set(
        state,
        'apiLambda.successes',
        countsFromApiGatewayData(action.data, 'LambdaAPISuccesses')
      );
      break;
    case DIST_APILAMBDA_INFLIGHT:
      set(state, 'apiLambda.inflight', true);
      break;
    case DIST_APILAMBDA_ERROR:
      set(state, 'apiLambda.inflight', false);
      set(state, 'apiLambda.error', action.error);
      break;
    case DIST_S3ACCESS:
      set(state, 's3Access.error', null);
      set(state, 's3Access.inflight', false);
      set(state, 's3Access.queriedAt', new Date(Date.now()));
      set(
        state,
        's3Access.errors',
        countsFromApiGatewayData(action.data, 's3AccessFailures')
      );
      set(
        state,
        's3Access.successes',
        countsFromApiGatewayData(action.data, 's3AccessSuccesses')
      );
      break;
    case DIST_S3ACCESS_INFLIGHT:
      set(state, 's3Access.inflight', true);
      break;
    case DIST_S3ACCESS_ERROR:
      set(state, 's3Access.inflight', false);
      set(state, 's3Access.error', action.error);
      break;
  }
  return state;
}
