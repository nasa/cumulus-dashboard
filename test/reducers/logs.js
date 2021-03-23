'use strict';

import test from 'ava';
import reducer from '../../app/src/js/reducers/logs';
import { LOGS_ERROR } from '../../app/src/js/actions/types';
import { initialState } from '../../app/src/js/reducers/logs';
import { metricsNotConfiguredMessage } from '../../app/src/js/utils/log';

test('LOGS_ERROR sets metricsNotConfigured to true when error indicated metrics is not configured', (t) => {
  const action = {
    type: LOGS_ERROR,
    error: metricsNotConfiguredMessage,
  }
  const expected = {
    ...initialState,
    inflight: false,
    error: action.error,
    metricsNotConfigured: true
  };
  const actual = reducer(initialState, action);
  t.deepEqual(expected, actual);
});

test('LOGS_ERROR does not set metricsNotConfigured to true for any other errors', (t) => {
  const action = {
    type: LOGS_ERROR,
    error: 'Other log error',
  }
  const expected = {
    ...initialState,
    inflight: false,
    error: action.error,
  };
  const actual = reducer(initialState, action);
  t.deepEqual(expected, actual);
});
