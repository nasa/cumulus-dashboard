'use strict';

import test from 'ava';

import { apiGatewayFixture } from '../fixtures/apiGatewayMetrics';
import { apiLambdaFixture } from '../fixtures/apiLambdaMetrics';
import { teaLambdaFixture } from '../fixtures/teaLambdaMetrics';
import { s3AccessFixture } from '../fixtures/s3AccessMetrics';
import reducer, { initialState } from '../../app/src/js/reducers/dist';
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
} from '../../app/src/js/actions/types';

const testDate = Date.now();
test.before((t) => {
  t.context.originalDate = Date.now;
  Date.now = () => testDate;
});

test.after((t) => {
  Date.now = t.context.originalDate;
});

test('verify initial state', (t) => {
  const newState = reducer(initialState, { data: {}, type: 'ANY' });
  t.deepEqual(newState, initialState);
});

test('reducers/dist/dist_apigateway', (t) => {
  const action = {
    type: DIST_APIGATEWAY,
    data: JSON.parse(apiGatewayFixture)
  };

  const expectedState = {
    ...initialState,
    apiGateway: {
      inflight: false,
      error: null,
      queriedAt: Date.now(),
      execution: {
        errors: 0,
        successes: 7
      },
      access: {
        errors: 1,
        successes: 20
      }
    }
  };
  const newState = reducer(initialState, action);
  t.deepEqual(expectedState, newState);
});

test('reducers/dist/dist_apigateway_inflight', (t) => {
  const action = { type: DIST_APIGATEWAY_INFLIGHT };
  const newState = reducer(initialState, action);
  t.true(newState.apiGateway.inflight);
});

test('reducers/dist/dist_apigateway_Error', (t) => {
  const initialState = {
    apiGateway: {
      inflight: true
    }
  };
  const action = { type: DIST_APIGATEWAY_ERROR, error: 'api error' };

  const expectedState = {
    apiGateway: {
      inflight: false,
      error: 'api error'
    }
  };
  const newState = reducer(initialState, action);
  t.deepEqual(expectedState, newState);
});

test('reducers/dist/dist_apilambda', (t) => {
  const action = {
    type: DIST_API_LAMBDA,
    data: JSON.parse(apiLambdaFixture)
  };

  const expectedState = {
    apiLambda: {
      inflight: false,
      error: null,
      queriedAt: Date.now(),
      errors: 10,
      successes: 4001
    }
  };
  const newState = reducer(initialState, action);
  t.deepEqual(expectedState.apiLambda, newState.apiLambda);
});

test('reducers/dist/dist_apilambda_inflight', (t) => {
  const action = {
    type: DIST_API_LAMBDA_INFLIGHT
  };
  const newState = reducer(initialState, action);
  t.true(newState.apiLambda.inflight);
});

test('reducers/dist/dist_apilambda_error', (t) => {
  const initialState = {
    apiLambda: {
      successes: 9,
      errors: 7,
      inflight: true
    }
  };
  const action = {
    type: DIST_API_LAMBDA_ERROR,
    error: 'api lambda error'
  };

  const expectedState = {
    apiLambda: {
      inflight: false,
      error: 'api lambda error',
      successes: 9,
      errors: 7
    }
  };
  const newState = reducer(initialState, action);
  t.deepEqual(expectedState.apiLambda, newState.apiLambda);
});

test('reducers/dist/dist_tea_lambda', (t) => {
  const action = {
    type: DIST_TEA_LAMBDA,
    data: JSON.parse(teaLambdaFixture)
  };

  const expectedState = {
    teaLambda: {
      inflight: false,
      error: null,
      queriedAt: Date.now(),
      errors: 18,
      successes: 34301
    }
  };
  const newState = reducer(initialState, action);
  t.deepEqual(expectedState.teaLambda, newState.teaLambda);
});

test('reducers/dist/dist_tea_lambda_inflight', (t) => {
  const action = { type: DIST_TEA_LAMBDA_INFLIGHT };
  const newState = reducer(initialState, action);
  t.true(newState.teaLambda.inflight);
});

test('reducers/dist/dist_tea_lambda_error', (t) => {
  const initialState = {
    teaLambda: {
      successes: 9,
      errors: 7,
      inflight: true
    }
  };
  const action = {
    type: DIST_TEA_LAMBDA_ERROR,
    error: 'api lambda error'
  };

  const expectedState = {
    teaLambda: {
      inflight: false,
      error: 'api lambda error',
      successes: 9,
      errors: 7
    }
  };
  const newState = reducer(initialState, action);
  t.deepEqual(expectedState.teaLambda, newState.teaLambda);
});

test('reducers/dist/dist_s3access', (t) => {
  const action = {
    type: DIST_S3ACCESS,
    data: JSON.parse(s3AccessFixture)
  };

  const expectedState = {
    ...initialState,
    s3Access: {
      inflight: false,
      error: null,
      queriedAt: Date.now(),
      errors: 1,
      successes: 200
    }
  };
  const newState = reducer(initialState, action);
  t.deepEqual(expectedState, newState);
});

test('reducers/dist/dist_s3access_inflight', (t) => {
  const initialState = {
    apiLambda: {
      inflight: false
    },
    s3Access: {}
  };
  const expectedState = {
    apiLambda: {
      inflight: false,
    },
    s3Access: {
      inflight: true,
    },
  };
  const action = { type: DIST_S3ACCESS_INFLIGHT };
  const newState = reducer(initialState, action);

  t.deepEqual(expectedState, newState);
});

test('reducers/dist/dist_s3access_error', (t) => {
  const initialState = {
    s3Access: {
      successes: 34,
      errors: 90,
      inflight: true
    }
  };
  const action = {
    type: DIST_S3ACCESS_ERROR,
    error: 's3 Access error'
  };

  const expectedState = {
    s3Access: {
      inflight: false,
      error: 's3 Access error',
      successes: 34,
      errors: 90
    }
  };
  const newState = reducer(initialState, action);
  t.deepEqual(expectedState.s3Access, newState.s3Access);
});
