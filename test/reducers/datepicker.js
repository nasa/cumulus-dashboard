'use strict';

import test from 'ava';
import sinon from 'sinon';
import reducer, { initialState } from '../../app/src/js/reducers/datepicker';
import { allDateRanges, msPerDay, findDateRangeByValue } from '../../app/src/js/utils/datepicker';
import {
  DATEPICKER_DATECHANGE,
  DATEPICKER_DROPDOWN_FILTER,
  DATEPICKER_HOUR_FORMAT
} from '../../app/src/js/actions/types';

test('verify initial state', (t) => {
  const inputstate = { some: 'initialState' };
  const actual = reducer(inputstate, { data: {}, type: 'ANY' });
  t.deepEqual(actual, inputstate);
});

test('reducer sets initial state to have no set start/end times.', (t) => {
  const actual = reducer(undefined, { type: 'ANY' });
  t.is(actual.dateRange.label, 'Custom');
  t.is(actual.dateRange.value, 'Custom');
  t.is(actual.startDateTime, null);
  t.is(actual.endDateTime, null);
  t.is(actual.hourFormat, '12HR');
});

test('Dropdown: "Recent" sets start time to 24 hours ago and unsets end time.', (t) => {
  const testStart = Date.now();
  sinon.useFakeTimers(testStart);
  const state = {
    startDateTime: new Date('2020-03-16T19:50:24.757Z'),
    endDateTime: new Date('2020-03-17T00:00:00.000Z'),
    dateRange: findDateRangeByValue('Custom'),
    hourFormat: '12HR'
  };

  const action = {
    type: DATEPICKER_DROPDOWN_FILTER,
    data: { dateRange: { value: 'Recent', label: 'Recent' } }
  };

  const actual = reducer(state, action);

  t.is(actual.dateRange.label, 'Recent');
  t.is(actual.dateRange.value, 'Recent');
  t.is(actual.startDateTime.valueOf(), (new Date(testStart - msPerDay)).valueOf());
  t.is(actual.endDateTime, null);
  sinon.restore();
});

test('Dropdown: "All" sets displayed start time to -infinity and end time to infinity.', (t) => {
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
  t.is(actual.endDateTime, null);
  t.is(actual.startDateTime, null);
  sinon.restore();
});

test('Dropdown: "Custom" unsets start and end times.', (t) => {
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
  t.is(actual.startDateTime, null);
  t.is(actual.endDateTime, null);
});

test('Dropdown: "time event" sets the start and end time time to reflect the daterange.value in days', (t) => {
  const testStart = Date.now();
  sinon.useFakeTimers(testStart);
  const value = 130;
  const action = {
    type: DATEPICKER_DROPDOWN_FILTER,
    data: { dateRange: { value, label: '130 Days' } }
  };

  const actual = reducer(initialState(), action);
  t.not(actual.startDateTime, null);
  t.not(actual.endDateTime, null);
  t.is(actual.dateRange.label, '130 Days');
  t.is(actual.dateRange.value, value);
  t.is(actual.endDateTime.valueOf(), testStart);
  t.is(actual.startDateTime.valueOf(), testStart - 130 * 3600 * 24 * 1000);
  sinon.restore();
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
