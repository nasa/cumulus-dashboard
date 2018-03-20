'use strict';
import test from 'ava';
import reducer from '../../app/scripts/reducers/collections.js';
import { COLLECTIONS } from '../../app/scripts/actions';

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
