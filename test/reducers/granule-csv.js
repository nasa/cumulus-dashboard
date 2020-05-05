'use strict';
import test from 'ava';
import reducer, { initialState } from '../../app/src/js/reducers/granule-csv';
import {
  GRANULE_CSV,
  GRANULE_CSV_INFLIGHT,
  GRANULE_CSV_ERROR
} from '../../app/src/js/actions/types';

test('verify initial state', (t) => {
  const newState = reducer(initialState, { data: {}, type: 'ANY_OTHER_TYPE' });
  t.is(newState, initialState);
});

test('granule_csv', (t) => {
  const expected = {
    ...initialState,
    ...{ data: { payload: 'somePayload' }, inflight: false, error: null }
  };
  const action = {
    type: GRANULE_CSV,
    data: { payload: 'somePayload' }
  };
  const actual = reducer(initialState, action);
  t.deepEqual(expected, actual);
});

test('granule_csv_inflight', (t) => {
  const testState = {...initialState, ...{data: {payload: 'somePayload'}}};
  const expected = {
    ...testState,
    ...{ inflight: true, error: null }
  };
  const action = {
    type: GRANULE_CSV_INFLIGHT,
    data: {payload: 'shouldn\'t matter at all'}
  };
  const actual = reducer(testState, action);
  t.deepEqual(expected, actual);
});

test('granule_csv_error', (t) => {
  const testState = {
    ...initialState,
    ...{data: {payload: 'somePayload'}}
  };
  const expected = {
    ...testState,
    ...{ inflight: false, error: 'a new Error' }
  };
  const action = {
    type: GRANULE_CSV_ERROR,
    data: {payload: 'shouldn\'t matter at all'},
    error: 'a new Error'
  };
  const actual = reducer(testState, action);
  t.deepEqual(expected, actual);
});
