'use strict';

import test from 'ava';
import cloneDeep from 'lodash/cloneDeep';
import reducer, { initialState, updateSearchForPath} from '../../app/src/js/reducers/location-query-params';

test('updateSearchForPath action captures latest query params', (t) => {
  const inputState = cloneDeep(initialState);
  const route = '/granules';
  const routeQueryParams = '?test=123';
  const expected = cloneDeep(initialState);
  expected.search = {
    [route]: routeQueryParams,
  };

  const action = updateSearchForPath({ pathname: route, search: routeQueryParams });
  const actual = reducer(inputState, action);
  t.deepEqual(actual, expected);
});
