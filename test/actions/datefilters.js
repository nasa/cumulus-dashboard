'use strict';

import test from 'ava';
import nock from 'nock';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { requestMiddleware } from '../../app/src/js/middleware/request';
import { initialState } from '../../app/src/js/reducers/datepicker';
import {
  listGranules,
  listCollections,
  listPdrs,
  listProviders,
  listExecutions,
  listOperations,
  listRules
} from '../../app/src/js/actions';

const port = process.env.FAKEAPIPORT || 5001;

const middlewares = [requestMiddleware, thunk];

const mockStore = configureMockStore(middlewares);

test('listGranules uses datepicker state when requesting data from cumulus API ', (t) => {
  const testState = { ...initialState };
  const startDateTime = new Date('2020-01-18T13:05:00.000Z');
  const endDateTime = new Date('2020-02-10T20:55:00.000Z');
  testState.startDateTime = startDateTime;
  testState.endDateTime = endDateTime;

  const store = mockStore({
    datepicker: testState
  });

  nock(`https://localhost:${port}`)
    .get('/granules')
    .query(true)
    .reply(200);

  store.dispatch(listGranules());
  const dispatchedAction = store.getActions()[0];
  t.is(dispatchedAction.type, 'GRANULES_INFLIGHT');
  t.true('timestamp__from' in dispatchedAction.config.qs);
  t.true('timestamp__to' in dispatchedAction.config.qs);
  t.is(dispatchedAction.config.qs.timestamp__to, endDateTime.valueOf());
  t.is(dispatchedAction.config.qs.timestamp__from, startDateTime.valueOf());
});

test('listGranules add no extra information when datepicker state has not start of end time.', (t) => {
  const testState = { ...initialState };
  const startDateTime = null;
  const endDateTime = null;
  testState.startDateTime = startDateTime;
  testState.endDateTime = endDateTime;

  const store = mockStore({
    datepicker: testState
  });

  nock(`https://localhost:${port}`)
    .get('/granules')
    .query(true)
    .reply(200);

  store.dispatch(listGranules());
  const dispatchedAction = store.getActions()[0];
  t.is(dispatchedAction.type, 'GRANULES_INFLIGHT');
  t.false('timestamp__from' in dispatchedAction.config.qs);
  t.false('timestamp__to' in dispatchedAction.config.qs);
});

test('All implemented list endpoints pull data from datepicker state.', (t) => {
  const endpoints = [
    // {
    //   endpoint: '/collections',
    //   action: 'COLLECTIONS_INFLIGHT',
    //   dispatcher: listCollections
    // },
    { endpoint: '/pdrs', action: 'PDRS_INFLIGHT', dispatcher: listPdrs },
    {
      endpoint: '/providers',
      action: 'PROVIDERS_INFLIGHT',
      dispatcher: listProviders
    },
    {
      endpoint: '/executions',
      action: 'EXECUTIONS_INFLIGHT',
      dispatcher: listExecutions
    },
    {
      endpoint: '/asyncOperations',
      action: 'OPERATIONS_INFLIGHT',
      dispatcher: listOperations
    },
    { endpoint: '/rules', action: 'RULES_INFLIGHT', dispatcher: listRules }
  ];

  endpoints.forEach((e) => {
    console.log(`testing ${JSON.stringify(e)}`);
    const testState = { ...initialState };
    const endDateTime = new Date(Date.now());
    const startDateTime = new Date(endDateTime - 5 * 24 * 3600 * 1000);
    testState.startDateTime = startDateTime;
    testState.endDateTime = endDateTime;

    const store = mockStore({
      datepicker: testState
    });

    nock(`https://localhost:${port}`)
      .get(e.endpoint)
      .query(true)
      .reply(200);

    store.dispatch(e.dispatcher());
    const dispatchedAction = store.getActions()[0];
    t.is(dispatchedAction.type, e.action);
    t.true('timestamp__from' in dispatchedAction.config.qs);
    t.true('timestamp__to' in dispatchedAction.config.qs);
    store.clearActions();
  });
});
