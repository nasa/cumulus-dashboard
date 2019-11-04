'use strict';

import get from 'lodash.get';
import { set } from 'object-path';

import {
  DIST_APIGATEWAY,
  DIST_APIGATEWAY_INFLIGHT,
  DIST_APIGATEWAY_ERROR,
  DIST_API_LAMBDA,
  DIST_API_LAMBDA_INFLIGHT,
  DIST_API_LAMBDA_ERROR,
  DIST_TEA_LAMBDA,
  DIST_TEA_LAMBDA_INFLIGHT,
  DIST_TEA_LAMBDA_ERROR,
  DIST_S3ACCESS,
  DIST_S3ACCESS_INFLIGHT,
  DIST_S3ACCESS_ERROR
} from '../actions/types';

const initialState = {
  apiGateway: {
    execution: { errors: {}, successes: {} },
    access: { errors: {}, successes: {} }
  },
  apiLambda: { errors: {}, successes: {} },
  teaLambda: { errors: {}, successes: {} },
  s3Access: { errors: {}, successes: {} }
};

const countsFromElasticSearchQuery = (data, name) => {
  return get(data, `aggregations.2.buckets.${name}.doc_count`, null);
};

export default function reducer (state = initialState, action) {
  state = Object.assign({}, state);
  switch (action.type) {
    case DIST_APIGATEWAY:
      set(state, 'apiGateway.error', null);
      set(state, 'apiGateway.inflight', false);
      set(state, 'apiGateway.queriedAt', new Date(Date.now()));
      set(
        state,
        'apiGateway.access.errors',
        countsFromElasticSearchQuery(action.data, 'ApiAccessErrors')
      );
      set(
        state,
        'apiGateway.access.successes',
        countsFromElasticSearchQuery(action.data, 'ApiAccessSuccesses')
      );
      set(
        state,
        'apiGateway.execution.errors',
        countsFromElasticSearchQuery(action.data, 'ApiExecutionErrors')
      );
      set(
        state,
        'apiGateway.execution.successes',
        countsFromElasticSearchQuery(action.data, 'ApiExecutionSuccesses')
      );
      break;
    case DIST_APIGATEWAY_INFLIGHT:
      set(state, 'apiGateway.inflight', true);
      break;
    case DIST_APIGATEWAY_ERROR:
      set(state, 'apiGateway.inflight', false);
      set(state, 'apiGateway.error', action.error);
      break;
    case DIST_API_LAMBDA:
      set(state, 'apiLambda.error', null);
      set(state, 'apiLambda.inflight', false);
      set(state, 'apiLambda.queriedAt', new Date(Date.now()));
      set(
        state,
        'apiLambda.errors',
        countsFromElasticSearchQuery(action.data, 'LambdaAPIErrors')
      );
      set(
        state,
        'apiLambda.successes',
        countsFromElasticSearchQuery(action.data, 'LambdaAPISuccesses')
      );
      break;
    case DIST_API_LAMBDA_INFLIGHT:
      set(state, 'apiLambda.inflight', true);
      break;
    case DIST_API_LAMBDA_ERROR:
      set(state, 'apiLambda.inflight', false);
      set(state, 'apiLambda.error', action.error);
      break;
    case DIST_TEA_LAMBDA:
      set(state, 'teaLambda.error', null);
      set(state, 'teaLambda.inflight', false);
      set(state, 'teaLambda.queriedAt', new Date(Date.now()));
      set(
        state,
        'teaLambda.errors',
        countsFromElasticSearchQuery(action.data, 'TEALambdaErrors')
      );
      set(
        state,
        'teaLambda.successes',
        countsFromElasticSearchQuery(action.data, 'TEALambdaSuccesses')
      );
      break;
    case DIST_TEA_LAMBDA_INFLIGHT:
      set(state, 'teaLambda.inflight', true);
      break;
    case DIST_TEA_LAMBDA_ERROR:
      set(state, 'teaLambda.inflight', false);
      set(state, 'teaLambda.error', action.error);
      break;
    case DIST_S3ACCESS:
      set(state, 's3Access.error', null);
      set(state, 's3Access.inflight', false);
      set(state, 's3Access.queriedAt', new Date(Date.now()));
      set(
        state,
        's3Access.errors',
        countsFromElasticSearchQuery(action.data, 's3AccessFailures')
      );
      set(
        state,
        's3Access.successes',
        countsFromElasticSearchQuery(action.data, 's3AccessSuccesses')
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
