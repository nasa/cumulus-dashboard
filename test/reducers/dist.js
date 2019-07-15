'use strict';

import test from 'ava';

// import * as assignDateModule from '../../app/scripts/reducers/assign-date';
// assignDateModule.default = (object) => Object.assign({}, object, {queriedAt: 'fakeTime'});

import { apiGatewayFixture } from '../fixtures/apiGatewayMetrics';
import reducer from '../../app/scripts/reducers/dist';
import {
  DIST,
  DIST_INFLIGHT,
  DIST_ERROR,
  DIST_APIGATEWAY
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
  const initialState = {some: 'initialState'};
  const newState = reducer(initialState, {data: {}, type: 'ANY'});
  t.deepEqual(newState, initialState);
});

test('reducers/dist/dist', (t) => {
  const initialState = {};
  const action = {
    type: DIST,
    data: {errors: 5, successes: 7}
  };

  const expectedState = {
    data: {errors: 5, successes: 7, queriedAt: new Date(testDate)},
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
    data: {errors: 4, successes: 9},
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
    data: {errors: 4, successes: 9},
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
