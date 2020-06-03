'use strict';

import test from 'ava';
import cloneDeep from 'lodash.clonedeep';
import reducer, { initialState } from '../../app/src/js/reducers/granules';
import {
  BULK_GRANULE,
  BULK_GRANULE_CLEAR_ERROR,
  BULK_GRANULE_DELETE,
  BULK_GRANULE_DELETE_CLEAR_ERROR
} from '../../app/src/js/actions/types';

test('BULK_GRANULE', (t) => {
  const inputState = cloneDeep(initialState);
  const expected = cloneDeep(initialState);
  expected.bulk = {
    requestedId: { data: 'some Data', status: 'success', error: null }
  };

  const action = {
    type: BULK_GRANULE,
    config: { requestId: 'requestedId' },
    data: 'some Data'
  };

  const actual = reducer(inputState, action);

  t.deepEqual(expected, actual);
});

test('BULK_GRANULE_CLEAR_ERROR', (t) => {
  const inputState = cloneDeep(initialState);
  const requestId = 'requestedId';
  inputState.bulk = {
    [requestId]: {
      error: 'error'
    }
  };

  const expected = cloneDeep(initialState);
  expected.bulk = {
    [requestId]: {}
  };

  const action = {
    type: BULK_GRANULE_CLEAR_ERROR,
    requestId
  };

  const actual = reducer(inputState, action);

  t.deepEqual(expected, actual);
});

test('BULK_GRANULE_DELETE', (t) => {
  const inputState = cloneDeep(initialState);
  const expected = cloneDeep(initialState);
  expected.bulkDelete = {
    requestedId: { data: 'some data', status: 'success', error: null }
  };

  const action = {
    type: BULK_GRANULE_DELETE,
    config: { requestId: 'requestedId' },
    data: 'some data'
  };

  const actual = reducer(inputState, action);

  t.deepEqual(expected, actual);
});

test('BULK_GRANULE_DELETE_CLEAR_ERROR', (t) => {
  const inputState = cloneDeep(initialState);
  const requestId = 'requestedId';
  inputState.bulkDelete = {
    [requestId]: {
      error: 'error'
    }
  };

  const expected = cloneDeep(initialState);
  expected.bulkDelete = {
    [requestId]: {}
  };

  const action = {
    type: BULK_GRANULE_DELETE_CLEAR_ERROR,
    requestId
  };

  const actual = reducer(inputState, action);

  t.deepEqual(expected, actual);
});
