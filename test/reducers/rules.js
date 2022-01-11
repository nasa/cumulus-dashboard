'use strict';

import test from 'ava';
import cloneDeep from 'lodash/cloneDeep';
import reducer, { initialState } from '../../app/src/js/reducers/rules';
import {
  RULE_DISABLE_INFLIGHT,
  RULE_ENABLE
} from '../../app/src/js/actions/types';

test('RULE_ENABLE reducer', (t) => {
  const inputState = cloneDeep(initialState);
  const id = 'someRuleNameHere';
  inputState.disabled = {
    [id]: { status: 'anything', error: 'anything also' }
  };
  const expected = cloneDeep(initialState);
  expected.enabled = {
    [id]: { status: 'success', error: null, data: undefined }
  };

  const action = { type: RULE_ENABLE, id };
  const actual = reducer(inputState, action);
  t.falsy(actual.enabled.someRuleNameHere.data);
  t.deepEqual(expected, actual);
});

test('RULE_DISABLE_INFLIGHT reducer', (t) => {
  const inputState = cloneDeep(initialState);
  const id = 'someRuleName';
  inputState.disabled = { [id]: { status: 'success' } };

  const expected = cloneDeep(inputState);
  expected.disabled[id].status = 'inflight';

  const action = { type: RULE_DISABLE_INFLIGHT, id };
  const actual = reducer(inputState, action);
  t.falsy(actual.disabled.someRuleName.error);
  t.deepEqual(expected, actual);
});
