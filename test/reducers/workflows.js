'use strict';

import test from 'ava';
import sinon from 'sinon';
import cloneDeep from 'lodash/cloneDeep';
import reducer, { filterData, initialState } from '../../app/src/js/reducers/workflows';

const testData = [
  {name: 'HelloWorldWorkflow',
    template: 's3://bucket/cumulus/workflows/HelloWorldWorkflow.json',
    definition: {
      Comment: 'Tests Lambda update after redeploy', StartAt: 'StartStatus', States: {}}
  },
  {name: 'AnotherWorkflow',
    template: 's3://bucket/cumulus/workflows/differentWorkflow.json',
    definition: {
      Comment: 'Does Something Else', StartAt: 'SomewhereElse', States: {}}
  }];

test.beforeEach((t) => {
  t.context.testStart = Date.now();
  sinon.useFakeTimers(t.context.testStart);
});

test.afterEach((t) => {
  sinon.restore();
});

test('verify initial state', (t) => {
  const newState = reducer(initialState, { data: {}, type: 'ANY_OTHER_TYPE' });
  t.is(newState, initialState);
});

test('verify WORKFLOWS loadState', (t) => {
  const expected = cloneDeep({
    list: {
      data: testData,
      meta: {queriedAt: t.context.testStart},
      inflight: false,
      error: false,
    },
    map: {
      HelloWorldWorkflow: testData[0],
      AnotherWorkflow: testData[1],
    },
    searchString: '',
  });

  const actual = reducer(initialState, { type: 'WORKFLOWS', data: testData });
  t.deepEqual(expected, actual);
});

test('if state has searchString, data list is filtered on WORKFLOW', (t) => {
  const inState = cloneDeep(initialState);
  inState.searchString = 'World';

  const expected = cloneDeep({
    list: {
      data: [ testData[0] ],
      meta: {queriedAt: t.context.testStart},
      inflight: false,
      error: false,
    },
    map: {
      HelloWorldWorkflow: testData[0]
    },
    searchString: 'World',
  });

  const actual = reducer(inState, {type: 'WORKFLOWS', data: testData});

  t.deepEqual(expected, actual);
});

test('if state has searchString, data list is filtered on WORKFLOW and is case insenstive', (t) => {
  const inState = cloneDeep(initialState);
  inState.searchString = 'elloworld';

  const expected = cloneDeep({
    list: {
      data: [ testData[0] ],
      meta: {queriedAt: t.context.testStart},
      inflight: false,
      error: false,
    },
    map: {
      HelloWorldWorkflow: testData[0]
    },
    searchString: 'elloworld',
  });

  const actual = reducer(inState, {type: 'WORKFLOWS', data: testData});

  t.deepEqual(expected, actual);
});
