'use strict';

import test from 'ava';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
  listExecutions,
  listExecutionsByGranule,
  listGranules,
} from '../../app/src/js/actions';
import { requestMiddleware } from '../../app/src/js/middleware/request';
import { initialState } from '../../app/src/js/reducers/datepicker';

const middlewares = [requestMiddleware, thunk];
const mockStore = configureMockStore(middlewares);

test('listGranules calls the api with archived: false.', (t) => {
  const testState = { ...initialState };
  testState.startDateTime = null;
  testState.endDateTime = null;

  const store = mockStore({
    datepicker: testState
  });

  store.dispatch(listGranules({archived: false}));
  const dispatchedAction = store.getActions()[0];
  t.false(dispatchedAction.config.params.archived);
});

test('listGranules calls the api with no archived element if archived: true.', (t) => {
  const testState = { ...initialState };
  testState.startDateTime = null;
  testState.endDateTime = null;

  const store = mockStore({
    datepicker: testState
  });

  store.dispatch(listGranules({archived: true}));
  const dispatchedAction = store.getActions()[0];
  t.false('archived' in dispatchedAction.config.params);
});

test('listExecutions calls the api with archived: false.', (t) => {
  const testState = { ...initialState };
  testState.startDateTime = null;
  testState.endDateTime = null;

  const store = mockStore({
    datepicker: testState
  });

  store.dispatch(listExecutions({archived: false}));
  const dispatchedAction = store.getActions()[0];
  t.false(dispatchedAction.config.params.archived);
});

test('listExecutions calls the api with no archived element if archived: true.', (t) => {
  const testState = { ...initialState };
  testState.startDateTime = null;
  testState.endDateTime = null;

  const store = mockStore({
    datepicker: testState
  });

  store.dispatch(listExecutions({archived: true}));
  const dispatchedAction = store.getActions()[0];
  t.false('archived' in dispatchedAction.config.params);
});

test('listExecutionsByGranule calls the api with archived: false.', (t) => {
  const testState = { ...initialState };
  testState.startDateTime = null;
  testState.endDateTime = null;

  const store = mockStore({
    datepicker: testState
  });

  store.dispatch(listExecutionsByGranule('abc', {}, false));
  const dispatchedAction = store.getActions()[0];
  t.false(dispatchedAction.config.params.archived);
});

test('listExecutionsByGranule calls the api with no archived element if archived: true.', (t) => {
  const testState = { ...initialState };
  testState.startDateTime = null;
  testState.endDateTime = null;

  const store = mockStore({
    datepicker: testState
  });

  store.dispatch(listExecutionsByGranule('abc', {}, true));
  const dispatchedAction = store.getActions()[0];
  t.false('archived' in dispatchedAction.config.params);
});

test('listExecutions calls the api with default sort_key ["-updatedAt"].', (t) => {
  const testState = { ...initialState };
  testState.startDateTime = null;
  testState.endDateTime = null;

  const store = mockStore({
    datepicker: testState
  });

  store.dispatch(listExecutions({}));
  const dispatchedAction = store.getActions()[0];
  t.deepEqual(dispatchedAction.config.params.sort_key, ["-updatedAt"]);
});