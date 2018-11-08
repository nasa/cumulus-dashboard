'use strict';
import test from 'ava';
import reducer from '../../app/scripts/reducers/mmtURLs';
import { ADD_MMTURL } from '../../app/scripts/actions/index';
import { getCollectionId } from '../../app/scripts/utils/format';

test('verify initial state', (t) => {
  const newState = reducer({}, {data: {}, type: 'ANY'});
  t.deepEqual(newState, {});
});

test('reducers/mmtURLs', (t) => {
  const initialState = {};
  const action = {
    type: ADD_MMTURL,
    data: {name: 'collectionname', version: 'versionString', url: 'mmt url'}
  };
  const key = getCollectionId({name: 'collectionname', version: 'versionString'});
  const expectedState = {
    [key]: 'mmt url'
  };
  const newState = reducer(initialState, action);
  t.deepEqual(expectedState, newState);
});

test.todo('reducers/mmtURLs with initial state');
