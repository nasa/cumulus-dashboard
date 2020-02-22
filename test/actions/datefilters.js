'use strict';

import test from 'ava';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
  getExecutionLogs,
  getLogs,
  listCollections,
  listExecutions,
  listGranules,
  listOperations,
  listPdrs,
  listProviders,
  listReconciliationReports,
  listRules,
  listWorkflows
} from '../../app/src/js/actions';
import { requestMiddleware } from '../../app/src/js/middleware/request';
import { initialState } from '../../app/src/js/reducers/datepicker';

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

  store.dispatch(listGranules());
  const dispatchedAction = store.getActions()[0];
  t.is(dispatchedAction.type, 'GRANULES_INFLIGHT');
  t.true('timestamp__from' in dispatchedAction.config.qs);
  t.true('timestamp__to' in dispatchedAction.config.qs);
  t.is(dispatchedAction.config.qs.timestamp__to, endDateTime.valueOf());
  t.is(dispatchedAction.config.qs.timestamp__from, startDateTime.valueOf());
});

test('listGranules add no information when datepicker has no start or end time.', (t) => {
  const testState = { ...initialState };
  const startDateTime = null;
  const endDateTime = null;
  testState.startDateTime = startDateTime;
  testState.endDateTime = endDateTime;

  const store = mockStore({
    datepicker: testState
  });

  store.dispatch(listGranules());
  const dispatchedAction = store.getActions()[0];
  t.is(dispatchedAction.type, 'GRANULES_INFLIGHT');
  t.false('timestamp__from' in dispatchedAction.config.qs);
  t.false('timestamp__to' in dispatchedAction.config.qs);
});

test('These list endpoints pull data from datepicker state.', (t) => {
  const endpoints = [
    { action: 'COLLECTIONS_INFLIGHT', dispatcher: listCollections },
    { action: 'PDRS_INFLIGHT', dispatcher: listPdrs },
    { action: 'PROVIDERS_INFLIGHT', dispatcher: listProviders },
    { action: 'EXECUTIONS_INFLIGHT', dispatcher: listExecutions },
    { action: 'OPERATIONS_INFLIGHT', dispatcher: listOperations },
    { action: 'RULES_INFLIGHT', dispatcher: listRules },
    { action: 'LOGS_INFLIGHT', dispatcher: getLogs }
  ];

  endpoints.forEach((e) => {
    const testState = { ...initialState };
    const endDateTime = new Date(Date.now());
    const startDateTime = new Date(endDateTime - 5 * 24 * 3600 * 1000);
    testState.startDateTime = startDateTime;
    testState.endDateTime = endDateTime;

    const store = mockStore({
      datepicker: testState
    });

    store.dispatch(e.dispatcher());
    const dispatchedAction = store.getActions()[0];
    t.is(dispatchedAction.type, e.action);
    t.true('timestamp__from' in dispatchedAction.config.qs);
    t.true('timestamp__to' in dispatchedAction.config.qs);
    store.clearActions();
  });
});

test('These list endpoints do not use data from datepicker state.', (t) => {
  const endpoints = [
    { action: 'WORKFLOWS_INFLIGHT', dispatcher: listWorkflows },
    { action: 'RECONCILIATIONS_INFLIGHT', dispatcher: listReconciliationReports },
    { action: 'EXECUTION_LOGS_INFLIGHT', dispatcher: getExecutionLogs }
  ];

  endpoints.forEach((e) => {
    const testState = { ...initialState };
    const endDateTime = new Date(Date.now());
    const startDateTime = new Date(endDateTime - 5 * 24 * 3600 * 1000);
    testState.startDateTime = startDateTime;
    testState.endDateTime = endDateTime;

    const store = mockStore({
      datepicker: testState
    });

    store.dispatch(e.dispatcher());
    const dispatchedAction = store.getActions()[0];
    t.is(dispatchedAction.type, e.action);
    if ('qs' in dispatchedAction.config) {
      t.false('timestamp__from' in dispatchedAction.config.qs);
      t.false('timestamp__to' in dispatchedAction.config.qs);
    }
    store.clearActions();
  });
});
