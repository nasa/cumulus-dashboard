'use strict';
import test from 'ava';
import reducer from '../../app/scripts/reducers/cumulus-instance';
import { ADD_INSTANCE_META } from '../../app/scripts/actions/types';

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
