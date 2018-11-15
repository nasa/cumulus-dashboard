'use strict';
import test from 'ava';
import reducer from '../../app/scripts/reducers/cumulus-instance';
import { ADD_CMR, ADD_CMR_ENVIRONMENT, ADD_CMR_PROVIDER } from '../../app/scripts/actions/index';

test('verify initial state', (t) => {
  const newState = reducer({}, {data: {}, type: 'ANY'});
  t.deepEqual(newState, {});
});

test('reducers/cumulus-instance/add_cmr_environment', (t) => {
  const initialState = {};
  const action = {
    type: ADD_CMR_ENVIRONMENT,
    data: {cmr: {environment: 'cmr environment value'}}
  };

  const expectedState = {
    cmrEnvironment: 'cmr environment value'
  };
  const newState = reducer(initialState, action);
  t.deepEqual(expectedState, newState);
});

test('reducers/cumulus-instance/add_cmr_provider', (t) => {
  const initialState = {};
  const action = {
    type: ADD_CMR_PROVIDER,
    data: {cmr: {provider: 'cmr provider value'}}
  };

  const expectedState = {
    cmrProvider: 'cmr provider value'
  };
  const newState = reducer(initialState, action);
  t.deepEqual(expectedState, newState);
});

test('reducers/cumulus-instance/add_cmr', (t) => {
  const initialState = {};
  const action = {
    type: ADD_CMR,
    data: {cmr: {provider: 'cmr provider value'}}
  };

  const expectedState = {
    cmrProvider: 'cmr provider value'
  };
  const newState = reducer(initialState, action);
  t.deepEqual(expectedState, newState);
});

test('reducer with initial state', (t) => {
  const initialState = {'cmrProvider': 'had provider'};

  const action = {
    type: ADD_CMR_ENVIRONMENT,
    data: {cmr: {environment: 'cmr environment value'}}
  };

  const expectedState = {
    cmrProvider: 'had provider',
    cmrEnvironment: 'cmr environment value'
  };
  const newState = reducer(initialState, action);
  t.deepEqual(expectedState, newState);
});

test('Updated values in reducer with initial state', (t) => {
  const initialState = {'cmrProvider': 'had provider'};

  const action = {
    type: ADD_CMR,
    data: {cmr: {environment: 'new cmr environment value'}}
  };

  const expectedState = {
    cmrProvider: 'had provider',
    cmrEnvironment: 'new cmr environment value'
  };
  const newState = reducer(initialState, action);
  t.deepEqual(expectedState, newState);
});
