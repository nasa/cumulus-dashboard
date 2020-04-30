'use strict';
import test from 'ava';
import reducer, { initialState } from '../../app/src/js/reducers/collections.js';
import { COLLECTIONS } from '../../app/src/js/actions/types';

test('reducers/collections', function (t) {
  const initialState = {
    map: { data: { sylvo: {} } },
    list: { data: { collectionName: 'sylvo' } }
  };
  const action = {
    type: COLLECTIONS,
    data: {
      results: [
        { collectionName: 'norm' },
        { collectionName: 'barry' }
      ]
    }
  };
  var newState = reducer(initialState, action);
  // list collections overwrites state.list
  t.deepEqual(newState.list.data.map(d => d.collectionName).sort(), ['norm', 'barry'].sort());
});

test('reducers/collections COLLECTION_APPLYWORKFLOW', (t) => {
  const testState = { ...initialState };
  const action = {
    type: 'COLLECTION_APPLYWORKFLOW',
    id: 'someid'
  };

  const expected = { ...initialState };
  expected.executed.someid = { status: 'success', error: null };

  const actual = reducer(testState, action);

  t.deepEqual(expected, actual);
});
