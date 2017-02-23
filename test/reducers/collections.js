'use strict';
import test from 'tape';
import reducer from '../../app/scripts/reducers/collections.js';
import { LIST_COLLECTIONS } from '../../app/scripts/actions';

test('reducers/collections', function (t) {
  const initialState = {
    map: { sylvo: {} },
    list: [ { collectionName: 'sylvo' } ]
  };
  const action = {
    type: LIST_COLLECTIONS,
    data: [
      { collectionName: 'norm' },
      { collectionName: 'barry' }
    ]
  };
  var newState = reducer(initialState, action);
  // list collections extends state.map
  t.deepEqual(Object.keys(newState.map).sort(), ['norm', 'barry', 'sylvo'].sort());
  // list collections overwrites state.list
  t.deepEqual(newState.list.map(d => d.collectionName).sort(), ['norm', 'barry'].sort());
  t.end();
});
