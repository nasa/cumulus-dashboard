'use strict';

import test from 'ava';
import reducer from '../../app/src/js/reducers/sidebar';
import { TOGGLE_SIDEBAR } from '../../app/src/js/actions/types';

test('initialState begins with sidebar open', (t) => {
  const expected = { open: true };
  const actual = reducer(undefined, { type: 'ANY' });
  t.deepEqual(expected, actual);
});

test('TOGGLE_SIDEBAR', (t) => {
  const inputState = { open: true };
  const expected = { open: false };
  const action = { type: TOGGLE_SIDEBAR };
  const actual = reducer(inputState, action);
  t.deepEqual(expected, actual);
});
