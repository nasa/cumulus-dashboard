'use strict';

import test from 'ava';
import cloneDeep from 'lodash.clonedeep';
import reducer, { initialState } from '../../app/src/js/reducers/granules';
import { BULK_GRANULE } from '../../app/src/js/actions/types';

test('BULK_GRANULE', (t) => {
  // case BULK_GRANULE:
  // const { id, data, config } = action;
  // set(state, ['bulk', config.requestId, 'data'], data);
  // set(state, ['bulk', config.requestId, 'status'], 'success');
  // set(state, ['bulk', config.requestId, 'error'], null);
  // break;
  const inputState = cloneDeep(initialState);
  const expected = cloneDeep(initialState);
  expected.bulk = {
    requestedId: { data: 'some Data', status: 'success', error: null }
  };

  const action = {
    type: BULK_GRANULE,
    config: { requestId: 'requestedId' },
    data: 'some Data'
  };

  const actual = reducer(inputState, action);

  t.deepEqual(expected, actual);
});
