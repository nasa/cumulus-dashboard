'use strict';
import test from 'ava';
import reducer from '../../app/scripts/reducers/mmtLinks';
import { ADD_MMTLINK } from '../../app/scripts/actions/types';
import { getCollectionId } from '../../app/scripts/utils/format';

test('verify initial state', (t) => {
  const newState = reducer({}, {data: {}, type: 'ANY'});
  t.deepEqual(newState, {});
});

test('reducers/mmtLinks', (t) => {
  const initialState = {};
  const action = {
    type: ADD_MMTLINK,
    data: {name: 'collectionname', version: 'versionString', url: 'mmt url'}
  };
  const key = getCollectionId({name: 'collectionname', version: 'versionString'});
  const expectedState = {
    [key]: 'mmt url'
  };
  const newState = reducer(initialState, action);
  t.deepEqual(expectedState, newState);
});

test('reducers/mmtLinks with initial state', (t) => {
  const initialState = {
    'collectionname___versionString': 'initial MMT URL',
    'differentcollection___versionString': 'some other MMT URL'
  };

  const action = {
    type: ADD_MMTLINK,
    data: {name: 'collectionname', version: 'versionString', url: 'updated MMT url'}
  };
  const key = getCollectionId({name: 'collectionname', version: 'versionString'});
  const expectedState = {
    [key]: 'updated MMT url',
    'differentcollection___versionString': 'some other MMT URL'
  };
  const newState = reducer(initialState, action);
  t.deepEqual(expectedState, newState);
});
