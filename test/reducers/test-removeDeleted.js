'use strict';

import test from 'ava';
import { randomBytes } from 'crypto';

import removeDeleted from '../../app/src/js/reducers/utils/remove-deleted';

const randomId = (id) => `${id}${randomBytes(5).toString('hex')}`;

const initialList = [
  {
    accessorName: randomId('first'),
    status: 'completed'
  },
  {
    accessorName: randomId('second'),
    status: 'success'
  },
  {
    accessorName: randomId('third'),
    status: 'completed',
    junk: 'unused'
  }
];

test('removeDeleted, returns input list if deleted is empty', (t) => {
  const initialAccessor = 'accessorName';
  const deleted = {};
  const result = removeDeleted(initialAccessor, initialList, deleted);
  t.deepEqual(result, initialList);
});

test('removeDeleted, returns filtered list if successful deleted found', (t) => {
  const initialAccessor = 'accessorName';
  const deletedId = initialList[1].accessorName;
  const expectedList = [initialList[0], initialList[2]];
  const deleted = { [deletedId]: { status: 'success' } };
  const result = removeDeleted(initialAccessor, initialList, deleted);
  t.deepEqual(result, expectedList);
});
