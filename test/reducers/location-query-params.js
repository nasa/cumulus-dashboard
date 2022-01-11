'use strict';

import test from 'ava';
import cloneDeep from 'lodash/cloneDeep';
import reducer, { initialState } from '../../app/src/js/reducers/location-query-params';
import { LOCATION_CHANGE } from 'connected-react-router';

test('LOCATION_CHANGE reducer captures latest query params', (t) => {
  const inputState = cloneDeep(initialState);
  const route = '/granules';
  const routeQueryParams = '?test=123';
  inputState.prevLocationPathname = route;
  const expected = cloneDeep(initialState);
  expected.search = {
    [route]: routeQueryParams,
  };
  expected.prevLocationPathname = route;

  const action = { type: LOCATION_CHANGE, payload: { location: { pathname: route, search: routeQueryParams } } };
  const actual = reducer(inputState, action);
  t.deepEqual(expected, actual);
});
