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
    execution: { errors: 0, successes: 0 },
    access: { errors: 0, successes: 0 },
  },
  apiLambda: { errors: 0, successes: 0 },
  teaLambda: { errors: 0, successes: 0 },
  s3Access: { errors: 0, successes: 0 },
};

const count = (data, name) =>
  get(data, `aggregations.2.buckets.${name}.doc_count`, 0);

export default createReducer(initialState, {
  [DIST_APIGATEWAY]: ({ apiGateway }, { data }) => {
    apiGateway.error = null;
    apiGateway.inflight = false;
    apiGateway.queriedAt = Date.now();
    apiGateway.access.errors = count(data, 'ApiAccessErrors');
    apiGateway.access.successes = count(data, 'ApiAccessSuccesses');
    apiGateway.execution.errors = count(data, 'ApiExecutionErrors');
    apiGateway.execution.successes = count(data, 'ApiExecutionSuccesses');
  },
  [DIST_APIGATEWAY_INFLIGHT]: ({ apiGateway }) => {
    apiGateway.inflight = true;
  },
  [DIST_APIGATEWAY_ERROR]: ({ apiGateway }, { error }) => {
    apiGateway.inflight = false;
    apiGateway.error = error;
  },
  [DIST_API_LAMBDA]: ({ apiLambda }, { data }) => {
    apiLambda.error = null;
    apiLambda.inflight = false;
    apiLambda.queriedAt = Date.now();
    apiLambda.errors = count(data, 'LambdaAPIErrors');
    apiLambda.successes = count(data, 'LambdaAPISuccesses');
  },
  [DIST_API_LAMBDA_INFLIGHT]: ({ apiLambda }) => {
    apiLambda.inflight = true;
  },
  [DIST_API_LAMBDA_ERROR]: ({ apiLambda }, { error }) => {
    apiLambda.inflight = false;
    apiLambda.error = error;
  },
  [DIST_TEA_LAMBDA]: ({ teaLambda }, { data }) => {
    teaLambda.error = null;
    teaLambda.inflight = false;
    teaLambda.queriedAt = Date.now();
    teaLambda.errors = count(data, 'TEALambdaErrors');
    teaLambda.successes = count(data, 'TEALambdaSuccesses');
  },
  [DIST_TEA_LAMBDA_INFLIGHT]: ({ teaLambda }) => {
    teaLambda.inflight = true;
  },
  [DIST_TEA_LAMBDA_ERROR]: ({ teaLambda }, { error }) => {
    teaLambda.inflight = false;
    teaLambda.error = error;
  },
  [DIST_S3ACCESS]: ({ s3Access }, { data }) => {
    s3Access.error = null;
    s3Access.inflight = false;
    s3Access.queriedAt = Date.now();
    s3Access.errors = count(data, 's3AccessFailures');
    s3Access.successes = count(data, 's3AccessSuccesses');
  },
  [DIST_S3ACCESS_INFLIGHT]: ({ s3Access }) => {
    s3Access.inflight = true;
  },
  [DIST_S3ACCESS_ERROR]: ({ s3Access }, { error }) => {
    s3Access.inflight = false;
    s3Access.error = error;
  },
});
