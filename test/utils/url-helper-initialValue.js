'use strict';

import test from 'ava';

import { initialValueFromLocation } from '../../app/src/js/utils/url-helper';

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
