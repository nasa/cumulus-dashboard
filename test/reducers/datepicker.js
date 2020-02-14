'use strict';

import test from 'ava';
import reducer, { initialState } from '../../app/src/js/reducers/datepicker';
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

test('reducer sets initial state of all data on first run with no input', (t) => {
  const actual = reducer(undefined, { type: 'ANY' });
  t.is(actual.dateRange.label, 'All');
  t.is(actual.dateRange.value, 'All');
  t.is(actual.startDateTime, null);
  t.is(actual.endDateTime, null);
  t.is(actual.hourFormat, '12HR');
});

test('dropdown event sets the "end-start" time to the daterange.value days', (t) => {
  const value = 130;
  const action = {
    type: DATEPICKER_DROPDOWN_FILTER,
    data: { dateRange: { value, label: 'Latest Random Days' } }
  };

  const actual = reducer(initialState, action);
  t.not(actual.startDateTime, null);
  t.not(actual.endDateTime, null);
  t.is(actual.dateRange.label, 'Latest Random Days');
  t.is(actual.dateRange.value, value);
  t.is(
    actual.endDateTime.valueOf() - actual.startDateTime.valueOf(),
    value * 3600 * 24 * 1000
  );
});

test('datechange event updates state', (t) => {
  const startDateTime = new Date('2000-01-15T12:50:01');
  const endDateTime = new Date('2013-12-10T10:00:00');
  const state = { ...initialState };
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
  const state = { ...initialState };
  const action = {
    type: DATEPICKER_HOUR_FORMAT,
    data: 'any string'
  };

  const expected = { ...state };
  expected.hourFormat = 'any string';

  const actual = reducer(state, action);
  t.deepEqual(expected, actual);
});
