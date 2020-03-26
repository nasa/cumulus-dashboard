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
import { createReducer } from '@reduxjs/toolkit';

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

export default createReducer(initialState, {

  [DIST_APIGATEWAY]: (state, action) => {
    set(state, 'apiGateway.error', null);
    set(state, 'apiGateway.inflight', false);
    set(state, 'apiGateway.queriedAt', Date.now());
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
  },
  [DIST_APIGATEWAY_INFLIGHT]: (state, action) => {
    set(state, 'apiGateway.inflight', true);
  },
  [DIST_APIGATEWAY_ERROR]: (state, action) => {
    set(state, 'apiGateway.inflight', false);
    set(state, 'apiGateway.error', action.error);
  },
  [DIST_API_LAMBDA]: (state, action) => {
    set(state, 'apiLambda.error', null);
    set(state, 'apiLambda.inflight', false);
    set(state, 'apiLambda.queriedAt', Date.now());
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
  },
  [DIST_API_LAMBDA_INFLIGHT]: (state, action) => {
    set(state, 'apiLambda.inflight', true);
  },
  [DIST_API_LAMBDA_ERROR]: (state, action) => {
    set(state, 'apiLambda.inflight', false);
    set(state, 'apiLambda.error', action.error);
  },
  [DIST_TEA_LAMBDA]: (state, action) => {
    set(state, 'teaLambda.error', null);
    set(state, 'teaLambda.inflight', false);
    set(state, 'teaLambda.queriedAt', Date.now());
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
  },
  [DIST_TEA_LAMBDA_INFLIGHT]: (state, action) => {
    set(state, 'teaLambda.inflight', true);
  },
  [DIST_TEA_LAMBDA_ERROR]: (state, action) => {
    set(state, 'teaLambda.inflight', false);
    set(state, 'teaLambda.error', action.error);
  },
  [DIST_S3ACCESS]: (state, action) => {
    set(state, 's3Access.error', null);
    set(state, 's3Access.inflight', false);
    set(state, 's3Access.queriedAt', Date.now());
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
  },
  [DIST_S3ACCESS_INFLIGHT]: (state, action) => {
    set(state, 's3Access.inflight', true);
  },
  [DIST_S3ACCESS_ERROR]: (state, action) => {
    set(state, 's3Access.inflight', false);
    set(state, 's3Access.error', action.error);
  }
});
