'use strict';
import test from 'ava';
import reducer from '../../app/scripts/reducers/cumulusInstance';
import { ADD_CMR, ADD_CMR_ENVIRONMENT, ADD_CMR_PROVIDER } from '../../app/scripts/actions/index';

test('verify initial state', (t) => {
  const newState = reducer({}, {data: {}, type: 'ANY'});
  t.deepEqual(newState, {});
});

test('reducers/cumulusInstance/add_cmr_environment', (t) => {
  const initialState = {};
  const action = {
    type: ADD_CMR_ENVIRONMENT,
    data: {cmr: {environment: 'cmr environment value'}}
  };

  const expectedState = {
    cmr_environment: 'cmr environment value'
  };
  const newState = reducer(initialState, action);
  t.deepEqual(expectedState, newState);
});

test('reducers/cumulusInstance/add_cmr_provider', (t) => {
  const initialState = {};
  const action = {
    type: ADD_CMR_PROVIDER,
    data: {cmr: {provider: 'cmr provider value'}}
  };

  const expectedState = {
    cmr_provider: 'cmr provider value'
  };
  const newState = reducer(initialState, action);
  t.deepEqual(expectedState, newState);
});

test('reducers/cumulusInstance/add_cmr', (t) => {
  const initialState = {};
  const action = {
    type: ADD_CMR,
    data: {cmr: {provider: 'cmr provider value'}}
  };

  const expectedState = {
    cmr_provider: 'cmr provider value'
  };
  const newState = reducer(initialState, action);
  t.deepEqual(expectedState, newState);
});

test('reducer with initial state', (t) => {
  const initialState = {'cmr_provider': 'had provider'};

  const action = {
    type: ADD_CMR_ENVIRONMENT,
    data: {cmr: {environment: 'cmr environment value'}}
  };

  const expectedState = {
    cmr_provider: 'had provider',
    cmr_environment: 'cmr environment value'
  };
  const newState = reducer(initialState, action);
  t.deepEqual(expectedState, newState);
});

test('Updated values in reducer with initial state', (t) => {
  const initialState = {'cmr_provider': 'had provider'};

  const action = {
    type: ADD_CMR,
    data: {cmr: {environment: 'new cmr environment value'}}
  };

  const expectedState = {
    cmr_provider: 'had provider',
    cmr_environment: 'new cmr environment value'
  };
  const newState = reducer(initialState, action);
  t.deepEqual(expectedState, newState);
});
