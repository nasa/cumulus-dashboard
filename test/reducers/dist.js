'use strict';

import test from 'ava';

// import * as assignDateModule from '../../app/scripts/reducers/assign-date';
// assignDateModule.default = (object) => Object.assign({}, object, {queriedAt: 'fakeTime'});

import { apiGatewayFixture } from '../fixtures/apiGatewayMetrics';
import { apiLambdaFixture } from '../fixtures/apiLambdaMetrics';
import { s3AccessFixture } from '../fixtures/s3AccessMetrics';
import reducer from '../../app/scripts/reducers/dist';
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
} from '../../app/scripts/actions/types';

const testDate = Date.now();
test.before((t) => {
  t.context.originalDate = Date.now;
  Date.now = () => testDate;
});

test.after((t) => {
  Date.now = t.context.originalDate;
});

test('verify initial state', (t) => {
  const initialState = { some: 'initialState' };
  const newState = reducer(initialState, { data: {}, type: 'ANY' });
  t.deepEqual(newState, initialState);
});

test('reducers/dist/dist', (t) => {
  const initialState = {};
  const action = {
    type: DIST,
    data: { errors: 5, successes: 7 }
  };

  const expectedState = {
    data: { errors: 5, successes: 7, queriedAt: new Date(testDate) },
    inflight: false,
    error: null
  };

  const actualState = reducer(initialState, action);

  t.deepEqual(expectedState, actualState);
});

test('reducers/dist/dist_inflight', (t) => {
  const initialState = {
    data: {
      errors: 4,
      successes: 9
    },
    inflight: false,
    error: null
  };

  const action = {
    type: DIST_INFLIGHT
  };

  const expectedState = {
    data: { errors: 4, successes: 9 },
    inflight: true,
    error: null
  };

  const actualState = reducer(initialState, action);

  t.deepEqual(expectedState, actualState);
});

test('reducers/dist/dist_error', (t) => {
  const initialState = {
    data: {
      errors: 4,
      successes: 9
    },
    inflight: true,
    error: null
  };

  const action = {
    type: DIST_ERROR,
    error: 'an Error'
  };

  const expectedState = {
    data: { errors: 4, successes: 9 },
    inflight: false,
    error: 'an Error'
  };

  const actualState = reducer(initialState, action);

  t.deepEqual(expectedState, actualState);
});

test('reducers/dist/dist_apigateway', (t) => {
  const initialState = {};
  const action = {
    type: DIST_APIGATEWAY,
    data: JSON.parse(apiGatewayFixture)
  };

  const expectedState = {
    apiGateway: {
      inflight: false,
      error: null,
      queriedAt: new Date(Date.now()),
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
  const initialState = {};
  const action = { type: DIST_APIGATEWAY_INFLIGHT };

  const expectedState = {
    apiGateway: {
      inflight: true
    }
  };
  const newState = reducer(initialState, action);
  t.deepEqual(expectedState, newState);
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

test('reducers/dist/dist_lambda', (t) => {
  const initialState = {};
  const action = {
    type: DIST_APILAMBDA,
    data: JSON.parse(apiLambdaFixture)
  };

  const expectedState = {
    apiLambda: {
      inflight: false,
      error: null,
      queriedAt: new Date(Date.now()),
      errors: 10,
      successes: 4001
    }
  };
  const newState = reducer(initialState, action);
  t.deepEqual(expectedState, newState);
});

test('reducers/dist/dist_lambda_inflight', (t) => {
  const initialState = {};
  const action = {
    type: DIST_APILAMBDA_INFLIGHT
  };

  const expectedState = {
    apiLambda: {
      inflight: true
    }
  };
  const newState = reducer(initialState, action);
  t.deepEqual(expectedState, newState);
});

test('reducers/dist/dist_lambda_error', (t) => {
  const initialState = {
    apiLambda: {
      successes: 9,
      errors: 7,
      inflight: true
    }
  };
  const action = {
    type: DIST_APILAMBDA_ERROR,
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
  t.deepEqual(expectedState, newState);
});

test('reducers/dist/dist_s3access', (t) => {
  const initialState = {};
  const action = {
    type: DIST_S3ACCESS,
    data: JSON.parse(s3AccessFixture)
  };

  const expectedState = {
    s3Access: {
      inflight: false,
      error: null,
      queriedAt: new Date(Date.now()),
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
    }
  };
  const action = {
    type: DIST_S3ACCESS_INFLIGHT
  };

  const expectedState = {
    apiLambda: {
      inflight: false
    },
    s3Access: {
      inflight: true
    }
  };
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
  t.deepEqual(expectedState, newState);
});
