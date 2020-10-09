'use strict';

import test from 'ava';
import sinon from 'sinon';

import {
  getInitialValueFromLocation,
  initialValuesFromLocation,
  getPersistentQueryParams,
  historyPushWithQueryParams,
  __RewireAPI__ as URLHelperRewireAPI
} from '../../app/src/js/utils/url-helper';

URLHelperRewireAPI.__Rewire__('history', {
  push: sinon.fake(),
  location: {
    search: '?status=running&endDateTime=2000000&startDateTime=1000000'
  }
});

const history = URLHelperRewireAPI.__get__('history');

const location = {
  pathname: '/granules',
  search: '',
  hash: '',
  action: 'PUSH',
  key: 'fsz1dg',
  query: {},
};

test.afterEach((t) => {
  sinon.restore();
  URLHelperRewireAPI.__ResetDependency__('historyPushWithQueryParams');
});

test('getInitialValueFromLocation returns empty string if location query empty', (t) => {
  const testLocation = { ...location };
  const expectedInitialValue = '';
  const actualInitialValue = getInitialValueFromLocation({
    location: testLocation,
  });
  t.is(expectedInitialValue, actualInitialValue);
});

test('getInitialValueFromLocation returns empty string if paramKey missing', (t) => {
  const testLocation = { ...location };
  testLocation.query = { status: 'running' };
  const expectedInitialValue = '';
  const actualInitialValue = getInitialValueFromLocation({
    location: testLocation,
  });
  t.is(expectedInitialValue, actualInitialValue);
});

test('getInitialValueFromLocation returns query initialValue if paramKey found', (t) => {
  const testLocation = { ...location };
  testLocation.query = { status: 'running' };
  const expectedInitialValue = 'running';
  const actualInitialValue = getInitialValueFromLocation({
    location: testLocation,
    paramKey: 'status',
  });
  t.is(expectedInitialValue, actualInitialValue);
});

test('initialValuesFromLocation returns object with keys and initial values', (t) => {
  const testLocation = { ...location };
  testLocation.query = {
    dateRange: '1 week',
    hourFormat: '12HR',
    startDateTime: '2019-02-19T18:59:00Z',
    foo: 'bar',
  };
  const keys = [
    'name',
    'dateRange',
    'startDateTime',
    'endDateTime',
    'hourFormat',
  ];
  const expectedResult = {
    dateRange: '1 week',
    startDateTime: '2019-02-19T18:59:00Z',
    hourFormat: '12HR',
  };

  const actualResult = initialValuesFromLocation(testLocation, keys);
  t.deepEqual(expectedResult, actualResult);
});

test('getPersistentParams returns an empty string when no query params are present', (t) => {
  const location = {};
  const persistentParams = getPersistentQueryParams(location);

  t.is(persistentParams, '');
});

test('getPersistentParams returns an empty string when query params do not include startDateTime or endDateTime', (t) => {
  const location = {
    search: '?status=running',
  };
  const persistentParams = getPersistentQueryParams(location);

  t.is(persistentParams, '');
});

test('getPersistentParams returns an query string with startDateTime and endDateTime', (t) => {
  const location = {
    search: '?status=running&endDateTime=2000000&startDateTime=1000000',
  };
  const persistentParams = getPersistentQueryParams(location);
  const expectedParams = 'endDateTime=2000000&startDateTime=1000000';

  t.is(persistentParams, expectedParams);
});

test('historyPushWithQueryParams calls history.push with startDateTime and endDateTime in querystring', (t) => {
  const expectedParams = 'endDateTime=2000000&startDateTime=1000000';
  const path = '/granules';
  historyPushWithQueryParams(path);

  t.true(history.push.calledWith({
    pathname: path,
    search: expectedParams
  }));
});
