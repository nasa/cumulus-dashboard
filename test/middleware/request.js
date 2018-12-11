import test from 'ava';
import nock from 'nock';
import { CALL_API } from '../../app/scripts/actions';
import { doRequestMiddleware } from '../../app/scripts/middleware/request';

test.beforeEach((t) => {
  const doDispatch = () => {};
  const doGetState = () => {};
  t.context.nextHandler = doRequestMiddleware({dispatch: doDispatch, getState: doGetState});
});

test('should pass action to next if not an API request action', (t) => {
  const actionObj = {};

  const actionHandler = t.context.nextHandler(action => {
    t.deepEqual(action, actionObj);
  });

  actionHandler(actionObj);
});

test.cb('should return action with GET response for API request action', (t) => {
  const stubbedResponse = { message: 'success' };
  nock('http://localhost:5001')
    .get('/test-path')
    .reply(200, stubbedResponse);

  const requestAction = {
    type: 'TEST',
    method: 'GET',
    url: 'http://localhost:5001/test-path'
  };
  const actionObj = {
    [CALL_API]: requestAction
  };

  const expectedAction = {
    id: undefined,
    config: requestAction,
    type: 'TEST',
    data: stubbedResponse
  };

  const actionHandler = t.context.nextHandler(action => {
    t.deepEqual(action, expectedAction);
    t.end();
  });

  actionHandler(actionObj);
});

test.cb('should return action with POST response for API request action', (t) => {
  nock('http://localhost:5001')
    .post('/test-path')
    .reply(200, (_, requestBody) => {
      return requestBody;
    });

  const requestBody = { test: 'test' };
  const requestAction = {
    type: 'TEST',
    method: 'POST',
    url: 'http://localhost:5001/test-path',
    body: requestBody
  };
  const actionObj = {
    [CALL_API]: requestAction
  };

  const expectedAction = {
    id: undefined,
    config: requestAction,
    type: 'TEST',
    data: requestBody
  };

  const actionHandler = t.context.nextHandler(action => {
    t.deepEqual(action, expectedAction);
    t.end();
  });

  actionHandler(actionObj);
});

test.cb('should return action with PUT response for API request action', (t) => {
  nock('http://localhost:5001')
    .put('/test-path')
    .reply(200, (_, requestBody) => {
      return requestBody;
    });

  const requestBody = { test: 'test' };
  const requestAction = {
    type: 'TEST',
    method: 'PUT',
    url: 'http://localhost:5001/test-path',
    body: requestBody
  };
  const actionObj = {
    [CALL_API]: requestAction
  };

  const expectedAction = {
    id: undefined,
    config: requestAction,
    type: 'TEST',
    data: requestBody
  };

  const actionHandler = t.context.nextHandler(action => {
    t.deepEqual(action, expectedAction);
    t.end();
  });

  actionHandler(actionObj);
});

test.cb('should return action with DELETE response for API request action', (t) => {
  const stubbedResponse = { message: 'success' };
  nock('http://localhost:5001')
    .delete('/test-path')
    .reply(200, stubbedResponse);

  const requestAction = {
    type: 'TEST',
    method: 'DELETE',
    url: 'http://localhost:5001/test-path'
  };
  const actionObj = {
    [CALL_API]: requestAction
  };

  const expectedAction = {
    id: undefined,
    config: requestAction,
    type: 'TEST',
    data: stubbedResponse
  };

  const actionHandler = t.context.nextHandler(action => {
    t.deepEqual(action, expectedAction);
    t.end();
  });

  actionHandler(actionObj);
});
