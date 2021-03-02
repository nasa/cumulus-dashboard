'use strict';
import test from 'ava';
import reducer, { initialState } from '../../app/src/js/reducers/api-version';
import {
  API_VERSION,
  API_VERSION_ERROR,
  API_VERSION_COMPATIBLE,
  API_VERSION_INCOMPATIBLE
} from '../../app/src/js/actions/types';

test('verify initial state', (t) => {
  const newState = reducer(initialState, { data: {}, type: 'ANY_OTHER_TYPE' });
  t.is(newState, initialState);
});

test('set the version', (t) => {
  const expected = { ...initialState, versionNumber: 'cumulus-version' };
  const action = {
    type: API_VERSION,
    payload: { versionNumber: 'cumulus-version' }
  };
  const actual = reducer(initialState, action);
  t.deepEqual(expected, actual);
});

test('version error', (t) => {
  const testInitialState = {
    ...initialState,
    apiVersion: undefined
  };

  const actionErrorMessage = 'an error';
  const expected = {
    ...testInitialState,
    apiVersion: actionErrorMessage,
    warning: 'Failed to acquire Cumulus API Version'
  };

  const action = {
    type: API_VERSION_ERROR,
    payload: { error: { message: actionErrorMessage } }
  };

  const actual = reducer(testInitialState, action);
  t.deepEqual(expected, actual);
});

test('version compatible', (t) => {
  const testInitialState = { isCompatible: false, warning: 'hmmm' };
  const action = {
    type: API_VERSION_COMPATIBLE
  };
  const expected = { ...testInitialState, isCompatible: true, warning: '' };
  const actual = reducer(testInitialState, action);

  t.deepEqual(expected, actual);
});

test('version incompatible', (t) => {
  const testInitialState = { isCompatible: true, warning: '' };
  const warningMessage = 'warning message';
  const action = {
    type: API_VERSION_INCOMPATIBLE,
    payload: {
      warning: warningMessage
    }
  };

  const expected = {
    ...testInitialState,
    isCompatible: false,
    warning: warningMessage
  };
  const actual = reducer(testInitialState, action);
  t.deepEqual(expected, actual);
});
