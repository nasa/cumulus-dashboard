'use strict';

import test from 'ava';

import {
  fetchCurrentTimeFilters,
  dropdownValue,
  allDateRanges,
  msPerDay
} from '../../app/src/js/utils/datepicker';

import { initialState } from '../../app/src/js/reducers/datepicker';

const testState = initialState();

test('fetchCurrentTimeFilters returns empty object if no start and end times provided', (t) => {
  const expected = {};
  let state = { ...testState };
  state.startDateTime = null;
  state.endDateTime = null;

  const actual = fetchCurrentTimeFilters(state);
  t.deepEqual(expected, actual);
});

test('fetchCurrentTimeFilters creates object with "timestamp__to" if endDateTime time is provided.', (t) => {
  let state = { ...testState };
  const valueOfDate = 1582307006281;
  const endDateTime = valueOfDate;
  state.endDateTime = endDateTime;
  state.startDateTime = null;

  const expected = { timestamp__to: valueOfDate };

  const actual = fetchCurrentTimeFilters(state);
  t.deepEqual(expected, actual);
});

test('fetchCurrentTimeFilters creates an object with "timestamp__from" if startDateTime time is provided.', (t) => {
  let state = { ...testState };
  const valueOfDate = 1582307006281;
  const startDateTime = valueOfDate;
  state.endDateTime = null;
  state.startDateTime = startDateTime;

  const expected = { timestamp__from: valueOfDate };

  const actual = fetchCurrentTimeFilters(state);
  t.deepEqual(expected, actual);
});

test('fetchCurrentTimeFilters creates an object with both timestamp__from and timestamp__to if start and end dates are provided.', (t) => {
  const state = { ...initialState() };
  const valueOfStartDate = 1501907006251;
  const valueOfEndDate = 1582307006281;

  const startDateTime = valueOfStartDate;
  const endDateTime = valueOfEndDate;
  state.startDateTime = startDateTime;
  state.endDateTime = endDateTime;

  const expected = {
    timestamp__from: valueOfStartDate,
    timestamp__to: valueOfEndDate
  };

  const actual = fetchCurrentTimeFilters(state);
  t.deepEqual(expected, actual);
});

test('dropdownValue returns the "Custom" value/label if object is missing a date.', (t) => {
  const values = { startDateTime: Date.now() };
  const expected = allDateRanges.find((e) => e.value === 'Custom');
  const actual = dropdownValue(values);
  t.deepEqual(expected, actual);
});

test('dropdownValue returns the "Custom" value/label if datetimes do not match any dropdown values.', (t) => {
  const values = {
    startDateTime: Date.now(),
    endDateTime: Date.now()
  };
  const expected = allDateRanges.find((e) => e.value === 'Custom');
  const actual = dropdownValue(values);
  t.deepEqual(expected, actual);
});

test('dropdownValue returns the correct value/label when datetimes match a dropdown value.', (t) => {
  const testValues = [1 / 24, 1, 7, 30, 90, 180, 366];

  testValues.forEach((testValue) => {
    const endDateTime = Date.now();
    const startDateTime = endDateTime - testValue * msPerDay;

    const values = {
      endDateTime,
      startDateTime
    };
    const expected = allDateRanges.find((e) => e.value === testValue);
    const actual = dropdownValue(values);
    t.deepEqual(expected, actual);
  });
});
