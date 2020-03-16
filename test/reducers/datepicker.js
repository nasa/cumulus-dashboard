'use strict';

import test from 'ava';
import sinon from 'sinon';
import reducer, { initialState } from '../../app/src/js/reducers/datepicker';
import {
  DATEPICKER_DATECHANGE,
  DATEPICKER_DROPDOWN_FILTER,
  DATEPICKER_HOUR_FORMAT
} from '../../app/src/js/actions/types';

const secondsPerDay = 60 * 60 * 24;

test('verify initial state', (t) => {
  const inputstate = { some: 'initialState' };
  const actual = reducer(inputstate, { data: {}, type: 'ANY' });
  t.deepEqual(actual, inputstate);
});

test('reducer sets initial state to last 24 hours data on first initialization run.', (t) => {
  const testStart = Date.now();
  sinon.useFakeTimers(testStart);
  const actual = reducer(undefined, { type: 'ANY' });
  t.is(actual.dateRange.label, 'Last 24 hours');
  t.is(actual.dateRange.value, 1);
  t.is(actual.startDateTime.valueOf(), (new Date(testStart - secondsPerDay * 1000)).valueOf());
  t.is(actual.endDateTime.valueOf(), (new Date(testStart)).valueOf());
  t.is(actual.hourFormat, '12HR');
  sinon.restore();
});

test('dropdown event sets the start and end time time to reflect the daterange.value in days', (t) => {
  const testStart = Date.now();
  sinon.useFakeTimers(testStart);
  const value = 130;
  const action = {
    type: DATEPICKER_DROPDOWN_FILTER,
    data: { dateRange: { value, label: 'Last 130 Days' } }
  };

  const actual = reducer(initialState(), action);
  t.not(actual.startDateTime, null);
  t.not(actual.endDateTime, null);
  t.is(actual.dateRange.label, 'Last 130 Days');
  t.is(actual.dateRange.value, value);
  t.is(actual.endDateTime.valueOf(), testStart);
  t.is(actual.startDateTime.valueOf(), testStart - 130 * 3600 * 24 * 1000);
  sinon.restore();
});

test('Dropdown set to "all" sets start time to unix epoch and end time to now.', (t) => {
  const testNow = Date.now();
  sinon.useFakeTimers(testNow);
  const value = 'All';
  const label = 'All';
  const action = {
    type: DATEPICKER_DROPDOWN_FILTER,
    data: { dateRange: { value, label } }
  };

  const actual = reducer(initialState(), action);
  t.is(actual.dateRange.label, 'All');
  t.is(actual.dateRange.value, 'All');
  t.is(actual.endDateTime.valueOf(), testNow);
  t.is(actual.startDateTime.valueOf(), (new Date(0)).valueOf());
  sinon.restore();
});

test('Dropdown set to "Custom" does not change any current state value.', (t) => {
  const state = initialState();
  state.startDateTime = new Date('2020-03-16T19:50:24.757Z');
  state.endDateTime = new Date('2020-03-17T00:00:00.000Z');
  const value = 'Custom';
  const label = 'Custom';
  const action = {
    type: DATEPICKER_DROPDOWN_FILTER,
    data: { dateRange: { value, label } }
  };

  const actual = reducer(state, action);
  t.is(actual.dateRange.label, 'Custom');
  t.is(actual.dateRange.value, 'Custom');
  t.is(actual.endDateTime.valueOf(), state.endDateTime.valueOf());
  t.is(actual.startDateTime.valueOf(), state.startDateTime.valueOf());
});

test('datechange event updates state', (t) => {
  const startDateTime = new Date('2000-01-15T12:50:01');
  const endDateTime = new Date('2013-12-10T10:00:00');
  const state = { ...initialState() };
  const action = {
    type: DATEPICKER_DATECHANGE,
    data: { startDateTime, endDateTime }
  };

  // expect original state updated with start & end times.
  const expected = { ...state };
  expected.startDateTime = startDateTime;
  expected.endDateTime = endDateTime;

  const actual = reducer(state, action);

  t.deepEqual(expected, actual);
});

test('datepicker Hour format, updates state', (t) => {
  const state = { ...initialState() };
  const action = {
    type: DATEPICKER_HOUR_FORMAT,
    data: 'any string'
  };

  const expected = { ...state };
  expected.hourFormat = 'any string';

  const actual = reducer(state, action);
  t.deepEqual(expected, actual);
});
