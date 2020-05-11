'use strict';

import test from 'ava';
import {
  createInflightReducer,
  createSuccessReducer,
  createClearItemReducer,
  createErrorReducer
} from '../../../app/src/js/reducers/utils/reducer-creators';

test('createInflightReducer, creates a working inflight reducer', (t) => {
  const inputState = { key: 'value' };
  const stateProp = 'theStateProp';
  const id = 'SomeIdField';

  const expected = {
    ...inputState,
    [stateProp]: { [id]: { status: 'inflight' } }
  };
  const theInflightReducer = createInflightReducer(stateProp);

  const action = { id };
  theInflightReducer(inputState, action);
  // Tests the mutated input state.
  t.deepEqual(expected, inputState);
});

test('createSuccessReducer, creates a working success reducer', (t) => {
  // Example success reducer
  // (state, action) => {
  //   const { id } = action;
  //   set(state, ['rerun', id, 'status'], 'success');
  //   set(state, ['rerun', id, 'error'], null);
  // };

  const inputState = { key: 'value' };

  const stateProp = 'rerun';
  const id = 'someIdField';

  const expected = {
    key: 'value',
    rerun: { someIdField: { status: 'success', error: null } }
  };
  const theSuccessReducer = createSuccessReducer(stateProp);

  const action = { id };
  theSuccessReducer(inputState, action);

  // Tests the mutated input state.
  // data is set to undefined in the success reducer when not part of the action.
  t.falsy(inputState.rerun.someIdField.data);
  delete inputState.rerun.someIdField.data;
  t.deepEqual(expected, inputState);
});

test('createClearItemReducer, creates a working success reducer on missing values', (t) => {
  const inputState = { key: 'value' };
  const theClearReducer = createClearItemReducer('doesnotexist');
  const action = { type: 'CLEAR_TYPE', id: 'what' };
  const expected = { ...inputState };

  theClearReducer(inputState, action);

  t.deepEqual(expected, inputState);
});

test('createClearItemReducer, creates a working success reducer with existing values', (t) => {
  const inputState = { key: 'value', exists: { first: 1, second: 2 } };
  const theClearReducer = createClearItemReducer('exists');
  const action = { type: 'CLEAR_TYPE', id: 'second' };
  const expected = { key: 'value', exists: { first: 1 } };

  theClearReducer(inputState, action);

  t.deepEqual(expected, inputState);
});

test('createErrorReducer, creates valid error reducer', (t) => {
  const inputState = { property: { someId: { status: 'inflight' } } };

  const expected = {
    property: { someId: { status: 'error', error: 'Bad Things Happened!' } }
  };

  const action = { error: 'Bad Things Happened!', id: 'someId' };

  const theErrorRedcer = createErrorReducer('property');

  theErrorRedcer(inputState, action);

  t.deepEqual(expected, inputState);
});

test('createErrorReducer, works with extra properties', (t) => {
  const inputState = { property: { someWrongId: { status: 'inflight' } } };

  const expected = {
    property: {
      someWrongId: { status: 'inflight' },
      someId: { status: 'error', error: 'Bad Things Happened!' }
    }
  };

  const action = { error: 'Bad Things Happened!', id: 'someId' };

  const theErrorRedcer = createErrorReducer('property');

  theErrorRedcer(inputState, action);

  t.deepEqual(expected, inputState);
});

test('createErrorReducer, works with missing properties', (t) => {
  const inputState = { wrongProperty: { someId: { status: 'inflight' } } };

  const expected = {
    wrongProperty: { someId: { status: 'inflight' } },
    property: { someId: { status: 'error', error: 'Bad Things Happened!' } }
  };

  const action = { error: 'Bad Things Happened!', id: 'someId' };

  const theErrorRedcer = createErrorReducer('property');

  theErrorRedcer(inputState, action);

  t.deepEqual(expected, inputState);
});
