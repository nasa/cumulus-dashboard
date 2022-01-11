'use strict';

import test from 'ava';
import cloneDeep from 'lodash/cloneDeep';
import reducer, { initialState } from '../../app/src/js/reducers/providers';
import { UPDATE_PROVIDER, OPTIONS_PROVIDERNAME } from '../../app/src/js/actions/types';

test('UPDATE_PROVIDER reducer', (t) => {
  const inputState = cloneDeep(initialState);
  const expected = cloneDeep(initialState);

  expected.map = { someProviderName: { data: 'some important data' } };
  expected.updated = { someProviderName: { status: 'success' } };

  const action = {
    type: UPDATE_PROVIDER,
    data: 'some important data',
    id: 'someProviderName'
  };
  const actual = reducer(inputState, action);
  t.deepEqual(expected, actual);
});

test('OPTIONS_PROVIDERGROUP reducer', (t) => {
  const inputState = cloneDeep(initialState);
  const expected = cloneDeep(initialState);

  expected.dropdowns = {
    provider: {
      options: [
        { id: 'provider1', label: 'provider1' },
        { id: 'provider2', label: 'provider2' }
      ]
    }
  }

  const action = {
    type: OPTIONS_PROVIDERNAME,
    data: {
      results: [
        { id: 'provider1' },
        { id: 'provider2' }
      ]
    }
  }

  const actual = reducer(inputState, action);
  t.deepEqual(expected, actual);
});
