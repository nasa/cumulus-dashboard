'use strict';

import test from 'ava';

import { fetchCurrentTimeFilters } from '../../app/src/js/utils/datepicker';

import { initialState } from '../../app/src/js/reducers/datepicker';

test('returns empty object if no start and end times provided', (t) => {
  const expected = {};

  const actual = fetchCurrentTimeFilters(initialState);
  t.deepEqual(expected, actual, 'did not create correct initial filters');
});

test('creates correct object if only endDateTime time is provided', (t) => {
  const state = { ...initialState };
  const valueOfDate = 1582307006281;
  const endDateTime = new Date(valueOfDate);
  state.endDateTime = endDateTime;

  const expected = { timestamp__to: valueOfDate };

  const actual = fetchCurrentTimeFilters(state);
  t.deepEqual(expected, actual);
});

test('creates an object with only timestamp_from if only startDateTime time is provided', (t) => {
  const state = { ...initialState };
  const valueOfDate = 1582307006281;
  const startDateTime = new Date(valueOfDate);
  state.startDateTime = startDateTime;

  const expected = { timestamp__from: valueOfDate };

  const actual = fetchCurrentTimeFilters(state);
  t.deepEqual(expected, actual);
});

test('creates an object with correct  timestamps when start and end dates are provides', (t) => {
  const state = { ...initialState };
  const valueOfStartDate = 1501907006251;
  const valueOfEndDate = 1582307006281;

  const startDateTime = new Date(valueOfStartDate);
  const endDateTime = new Date(valueOfEndDate);
  state.startDateTime = startDateTime;
  state.endDateTime = endDateTime;

  const expected = {
    timestamp__from: valueOfStartDate,
    timestamp__to: valueOfEndDate
  };

  const actual = fetchCurrentTimeFilters(state);
  t.deepEqual(expected, actual);
});
