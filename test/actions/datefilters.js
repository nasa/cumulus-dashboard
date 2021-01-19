'use strict';

import test from 'ava';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
  getExecutionLogs,
  getLogs,
  getStats,
  listCollections,
  listExecutions,
  listGranules,
  listOperations,
  listPdrs,
  listReconciliationReports,
  listRules,
  listWorkflows
} from '../../app/src/js/actions';
import { requestMiddleware } from '../../app/src/js/middleware/request';
import { initialState } from '../../app/src/js/reducers/datepicker';

const middlewares = [requestMiddleware, thunk];
const mockStore = configureMockStore(middlewares);

test('listGranules injects timestamps from datepicker state when calling the Cumulus API.', (t) => {
  const testState = { ...initialState };
  const startDateTime = new Date('2020-01-18T13:05:00.000Z');
  const endDateTime = new Date('2020-02-10T20:55:00.000Z');
  testState.startDateTime = startDateTime.valueOf();
  testState.endDateTime = endDateTime.valueOf();

  const store = mockStore({
    datepicker: testState
  });

  store.dispatch(listGranules());
  const dispatchedAction = store.getActions()[0];
  t.is(dispatchedAction.type, 'GRANULES_INFLIGHT');
  t.true('timestamp__from' in dispatchedAction.config.params);
  t.true('timestamp__to' in dispatchedAction.config.params);
  t.is(endDateTime.valueOf(), dispatchedAction.config.params.timestamp__to);
  t.is(startDateTime.valueOf(), dispatchedAction.config.params.timestamp__from);
});

test('listGranules does not inject information if datepicker state has no start or end values.', (t) => {
  const testState = { ...initialState };
  testState.startDateTime = null;
  testState.endDateTime = null;

  const store = mockStore({
    datepicker: testState
  });

  store.dispatch(listGranules());
  const dispatchedAction = store.getActions()[0];
  t.is(dispatchedAction.type, 'GRANULES_INFLIGHT');
  t.false('timestamp__from' in dispatchedAction.config.params);
  t.false('timestamp__to' in dispatchedAction.config.params);
});

test('Each of these list action creators will pull data from datepicker state when calling the Cumulus API.', (t) => {
  const endpoints = [
    { action: 'COLLECTIONS_INFLIGHT', dispatcher: listCollections },
    { action: 'EXECUTIONS_INFLIGHT', dispatcher: listExecutions },
    { action: 'GRANULES_INFLIGHT', dispatcher: listGranules },
    { action: 'LOGS_INFLIGHT', dispatcher: getLogs },
    { action: 'OPERATIONS_INFLIGHT', dispatcher: listOperations },
    { action: 'PDRS_INFLIGHT', dispatcher: listPdrs },
    { action: 'RECONCILIATIONS_INFLIGHT', dispatcher: listReconciliationReports },
    { action: 'RULES_INFLIGHT', dispatcher: listRules },
    { action: 'STATS_INFLIGHT', dispatcher: getStats }
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
    t.true('timestamp__from' in dispatchedAction.config.params);
    t.true('timestamp__to' in dispatchedAction.config.params);
    store.clearActions();
  });
});

test('Each of these list action creators will not use data from datepicker state when calling the Cumulus API.', (t) => {
  const endpoints = [
    { action: 'WORKFLOWS_INFLIGHT', dispatcher: listWorkflows },
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
    if ('params' in dispatchedAction.config) {
      t.false('timestamp__from' in dispatchedAction.config.params);
      t.false('timestamp__to' in dispatchedAction.config.params);
    }
    store.clearActions();
  });
});
