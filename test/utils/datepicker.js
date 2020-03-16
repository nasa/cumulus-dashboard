'use strict';

import test from 'ava';

import { fetchCurrentTimeFilters } from '../../app/src/js/utils/datepicker';

import { initialState } from '../../app/src/js/reducers/datepicker';

const testState = initialState();

test('returns empty object if no start and end times provided', (t) => {
  const expected = {};
  let state = {...testState};
  state.startDateTime = null;
  state.endDateTime = null;

  const actual = fetchCurrentTimeFilters(state);
  t.deepEqual(expected, actual);
});

test('creates object with "timestamp__to" if endDateTime time is provided.', (t) => {
  let state = { ...testState };
  const valueOfDate = 1582307006281;
  const endDateTime = new Date(valueOfDate);
  state.endDateTime = endDateTime;
  state.startDateTime = null;

  const expected = { timestamp__to: valueOfDate };

  const actual = fetchCurrentTimeFilters(state);
  t.deepEqual(expected, actual);
});

test('creates an object with "timestamp__from" if startDateTime time is provided.', (t) => {
  let state = { ...testState };
  const valueOfDate = 1582307006281;
  const startDateTime = new Date(valueOfDate);
  state.endDateTime = null;
  state.startDateTime = startDateTime;

  const expected = { timestamp__from: valueOfDate };

  const actual = fetchCurrentTimeFilters(state);
  t.deepEqual(expected, actual);
});

test('creates an object with both timestamp__from and timestamp__to if start and end dates are provided.', (t) => {
  const state = { ...initialState() };
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
