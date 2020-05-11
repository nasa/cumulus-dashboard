'use strict';

import get from 'lodash.get';
import { createReducer } from '@reduxjs/toolkit';
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
  DIST_S3ACCESS_ERROR,
} from '../actions/types';

export const initialState = {
  apiGateway: {
    execution: { errors: null, successes: null },
    access: { errors: null, successes: null },
  },
  apiLambda: { errors: null, successes: null },
  teaLambda: { errors: null, successes: null },
  s3Access: { errors: null, successes: null },
};

const count = (data, name) =>
  get(data, `aggregations.2.buckets.${name}.doc_count`, 0);

export default createReducer(initialState, {
  [DIST_APIGATEWAY]: (state, action) => {
    const { data } = action;
    state.apiGateway.error = null;
    state.apiGateway.inflight = false;
    state.apiGateway.queriedAt = Date.now();
    state.apiGateway.access.errors = count(data, 'ApiAccessErrors');
    state.apiGateway.access.successes = count(data, 'ApiAccessSuccesses');
    state.apiGateway.execution.errors = count(data, 'ApiExecutionErrors');
    state.apiGateway.execution.successes = count(data, 'ApiExecutionSuccesses');
  },
  [DIST_APIGATEWAY_INFLIGHT]: (state) => {
    state.apiGateway.inflight = true;
  },
  [DIST_APIGATEWAY_ERROR]: (state, action) => {
    state.apiGateway.inflight = false;
    state.apiGateway.error = action.error;
  },
  [DIST_API_LAMBDA]: (state, action) => {
    state.apiLambda.error = null;
    state.apiLambda.inflight = false;
    state.apiLambda.queriedAt = Date.now();
    state.apiLambda.errors = count(action.data, 'LambdaAPIErrors');
    state.apiLambda.successes = count(action.data, 'LambdaAPISuccesses');
  },
  [DIST_API_LAMBDA_INFLIGHT]: (state) => {
    state.apiLambda.inflight = true;
  },
  [DIST_API_LAMBDA_ERROR]: (state, action) => {
    state.apiLambda.inflight = false;
    state.apiLambda.error = action.error;
  },
  [DIST_TEA_LAMBDA]: (state, action) => {
    state.teaLambda.error = null;
    state.teaLambda.inflight = false;
    state.teaLambda.queriedAt = Date.now();
    state.teaLambda.errors = count(action.data, 'TEALambdaErrors');
    state.teaLambda.successes = count(action.data, 'TEALambdaSuccesses');
  },
  [DIST_TEA_LAMBDA_INFLIGHT]: (state) => {
    state.teaLambda.inflight = true;
  },
  [DIST_TEA_LAMBDA_ERROR]: (state, action) => {
    state.teaLambda.inflight = false;
    state.teaLambda.error = action.error;
  },
  [DIST_S3ACCESS]: (state, action) => {
    state.s3Access.error = null;
    state.s3Access.inflight = false;
    state.s3Access.queriedAt = Date.now();
    state.s3Access.errors = count(action.data, 's3AccessFailures');
    state.s3Access.successes = count(action.data, 's3AccessSuccesses');
  },
  [DIST_S3ACCESS_INFLIGHT]: (state) => {
    state.s3Access.inflight = true;
  },
  [DIST_S3ACCESS_ERROR]: (state, action) => {
    state.s3Access.inflight = false;
    state.s3Access.error = action.error;
  },
});
