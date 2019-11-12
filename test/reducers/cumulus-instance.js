'use strict';
import test from 'ava';
import reducer from '../../app/src/js/reducers/cumulus-instance';
import { ADD_INSTANCE_META } from '../../app/src/js/actions/types';

test('verify initial state', (t) => {
  const newState = reducer({}, {data: {}, type: 'ANY'});
  t.deepEqual(newState, {});
});

test('reducers/cumulus-instance/add_instance_meta', (t) => {
  const initialState = {};
  const action = {
    type: ADD_INSTANCE_META,
    data: {cmr: {provider: 'cmr provider value'}}
  };

  const expectedState = {
    cmrProvider: 'cmr provider value'
  };
  const newState = reducer(initialState, action);
  t.deepEqual(expectedState, newState);
});

test('handles cumulus.stackName data', (t) => {
  const initialState = {};
  const action = {
    type: ADD_INSTANCE_META,
    data: {cumulus: {stackName: 'fakeStack'}}
  };
  const expectedState = {
    stackName: 'fakeStack'
  };
  const newState = reducer(initialState, action);
  t.deepEqual(expectedState, newState);
});

test('ignores unused instance metadata.', (t) => {
  const initialState = {};
  const action = {
    type: ADD_INSTANCE_META,
    data: {unusedTopLevelMetadata: {whoCares: 'what is in here'}}
  };
  const expectedState = {};
  const newState = reducer(initialState, action);
  t.deepEqual(expectedState, newState);
});

test('Updated values in reducer with initial state', (t) => {
  const initialState = {'cmrProvider': 'had provider'};

  const action = {
    type: ADD_INSTANCE_META,
    data: {cmr: {environment: 'new cmr environment value'}}
  };

  const expectedState = {
    cmrProvider: 'had provider',
    cmrEnvironment: 'new cmr environment value'
  };
  const newState = reducer(initialState, action);
  t.deepEqual(expectedState, newState);
});

test('Updated multiple top level instance metadata on initial state', (t) => {
  const initialState = {'cmrProvider': 'had provider'};

  const action = {
    type: ADD_INSTANCE_META,
    data: {
      cmr: {environment: 'new cmr environment value'},
      cumulus: {stackName: 'new stackName'}
    }
  };

  const expectedState = {
    cmrProvider: 'had provider',
    cmrEnvironment: 'new cmr environment value',
    stackName: 'new stackName'
  };
  const newState = reducer(initialState, action);
  t.deepEqual(expectedState, newState);
});
