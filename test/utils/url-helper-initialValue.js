'use strict';

import test from 'ava';

import { initialValueFromLocation, initialValuesFromLocation } from '../../app/src/js/utils/url-helper';

const location = {
  pathname: '/granules',
  search: '',
  hash: '',
  action: 'PUSH',
  key: 'fsz1dg',
  query: {}
};

test('initialValueFromLocation returns empty string if location query empty', (t) => {
  const testLocation = { ...location };
  const expectedInitialValue = '';
  const actualInitialValue = initialValueFromLocation({
    location: testLocation
  });
  t.is(expectedInitialValue, actualInitialValue);
});

test('initialValueFromLocation returns empty string if paramKey missing', (t) => {
  const testLocation = { ...location };
  testLocation.query = { status: 'running' };
  const expectedInitialValue = '';
  const actualInitialValue = initialValueFromLocation({
    location: testLocation
  });
  t.is(expectedInitialValue, actualInitialValue);
});

test('initialValueFromLocation returns query initialValue if paramKey found', (t) => {
  const testLocation = { ...location };
  testLocation.query = { status: 'running' };
  const expectedInitialValue = 'running';
  const actualInitialValue = initialValueFromLocation({
    location: testLocation,
    paramKey: 'status'
  });
  t.is(expectedInitialValue, actualInitialValue);
});

test('initialValuesFromLocation returns object with keys and initial values', (t) => {
  const testLocation = { ...location };
  testLocation.query = {
    dateRange: '1 week',
    hourFormat: '12HR',
    startDateTime: '2019-02-19T18:59:00Z',
    foo: 'bar'
  };
  const keys = ['name', 'dateRange', 'startDateTime', 'endDateTime', 'hourFormat'];
  const expectedResult = {
    dateRange: '1 week',
    startDateTime: '2019-02-19T18:59:00Z',
    hourFormat: '12HR'
  };

  const actualResult = initialValuesFromLocation(testLocation, keys);
  t.deepEqual(expectedResult, actualResult);
});
