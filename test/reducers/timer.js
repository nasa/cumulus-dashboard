'use strict';

import test from 'ava';
import reducer, { initialState } from '../../app/src/js/reducers/timer';
import {
  TIMER_START,
  TIMER_SET_COUNTDOWN,
  TIMER_STOP,
} from '../../app/src/js/actions/types';

test('initialState begins with timer off', (t) => {
  const expected = { running: false, seconds: -1 };
  const actual = reducer(undefined, { type: 'ANY' });
  t.deepEqual(expected, actual);
});

test('TIMER_START', (t) => {
  const inputState = { running: false, seconds: -1 };
  const countdownSeconds = 100;
  const expected = { running: true, seconds: countdownSeconds };
  const action = { type: TIMER_START, secondsToRefresh: countdownSeconds };
  const actual = reducer(inputState, action);
  t.deepEqual(expected, actual);
});

test('TIMER_STOP', (t) => {
  const inputState = { running: true, seconds: 100 };
  const expected = { running: false, seconds: -1 };
  const action = { type: TIMER_STOP };
  const actual = reducer(inputState, action);
  t.deepEqual(expected, actual);
});

test('TIMER_SET_COUNTDOWN', (t) => {
  const inputState = { ...initialState };
  const countdownSeconds = 100;
  const expected = { ...initialState, seconds: countdownSeconds };
  const action = {
    type: TIMER_SET_COUNTDOWN,
    secondsToRefresh: countdownSeconds,
  };
  const actual = reducer(inputState, action);
  t.deepEqual(expected, actual);
});
