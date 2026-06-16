'use strict';
import test from 'ava';
import reducer from '../../app/src/js/reducers/collections.js';
import {
  COLLECTIONS,
  OPTIONS_COLLECTIONNAME,
} from '../../app/src/js/actions/types';

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

test('reducers/collections options sorted by updated date desc', function (t) {
  const initialState = { dropdowns: {} };
  const action = {
    type: OPTIONS_COLLECTIONNAME,
    data: {
      results: [
        {
          name: 'older',
          version: '001',
          updatedAt: '2024-01-01T00:00:00.000Z'
        },
        {
          name: 'newer',
          version: '002',
          updatedAt: '2024-05-01T00:00:00.000Z'
        },
        {
          name: 'fallback',
          version: '003',
          createdAt: '2024-03-01T00:00:00.000Z'
        }
      ]
    }
  };

  const newState = reducer(initialState, action);

  t.deepEqual(
    newState.dropdowns.collectionName.options.map((option) => option.id),
    ['newer___002', 'fallback___003', 'older___001']
  );
});
