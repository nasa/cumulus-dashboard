import test from 'ava';
import nock from 'nock';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { CALL_API } from '../../app/scripts/actions';
import { configureRequest } from '../../app/scripts/actions/helpers';
import { addRequestAuthMiddleware } from '../../app/scripts/middleware/auth';
import { doRequestMiddleware } from '../../app/scripts/middleware/request';

const middlewares = [
  addRequestAuthMiddleware,
  doRequestMiddleware,
  thunk
];
const mockStore = configureMockStore(middlewares);
const store = mockStore({
  api: {
    tokens: {
      token: 'fake-token'
    }
  }
});

test.beforeEach((t) => {
  const doDispatch = () => {};
  const doGetState = () => {};
  t.context.nextHandler = doRequestMiddleware({dispatch: doDispatch, getState: doGetState});
});

test.skip('promise', async (t) => {
  nock('http://localhost:5001')
    .get('/test-path')
    .reply(200);

  const requestAction = {
    type: 'TEST',
    method: 'GET',
    url: 'http://localhost:5001/test-path'
  };
  const actionObj = {
    [CALL_API]: requestAction
  };

  const test = await store.dispatch(actionObj);
  console.log(test);
  t.is(test, 'testing');
});

test('should send inflight action', (t) => {
  nock('http://localhost:5001')
    .get('/test-path')
    .reply(200);

  const requestAction = {
    type: 'TEST',
    method: 'GET',
    url: 'http://localhost:5001/test-path'
  };
  const actionObj = {
    [CALL_API]: requestAction
  };

  store.dispatch(actionObj);

  const requestConfig = configureRequest(requestAction);
  const expectedInflightAction = {
    id: undefined,
    type: 'TEST_INFLIGHT',
    config: {
      ...requestConfig,
      headers: {
        ...requestConfig.headers,
        Authorization: 'Bearer fake-token'
      }
    }
  };

  t.deepEqual(store.getActions(), [expectedInflightAction]);
});

test('should pass action to next if not an API request action', (t) => {
  const actionObj = {};

  const actionHandler = t.context.nextHandler(action => {
    t.deepEqual(action, actionObj);
  });

  actionHandler(actionObj);
});

test('should throw error if no method is set on API request action', (t) => {
  const actionObj = {
    [CALL_API]: {}
  };

  const actionHandler = t.context.nextHandler(() => {});

  try {
    actionHandler(actionObj);
    t.fail('Expected error to be thrown');
  } catch (err) {
    t.is(err.message, 'Request action must include a method');
  }
});

test.cb.only('should dispatch error action for failed request', (t) => {
  nock('http://localhost:5001')
    .get('/test-path')
    .reply(500, { message: 'Internal server error' });

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
    error: new Error('Internal server error'),
    config: configureRequest(requestAction),
    type: 'TEST_ERROR'
  };

  const actionHandler = t.context.nextHandler(action => {
    t.deepEqual(action, expectedAction);
    t.end();
  });

  actionHandler(actionObj);
});

test.cb('should return expected action for GET request action', (t) => {
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
    config: configureRequest(requestAction),
    type: 'TEST',
    data: stubbedResponse
  };

  const actionHandler = t.context.nextHandler(action => {
    t.deepEqual(action, expectedAction);
    t.end();
  });

  actionHandler(actionObj);
});

test.cb('should return expected action for GET request action with query state', (t) => {
  const queryParams = {
    limit: 1,
    otherParam: 'value'
  };
  const stubbedResponse = { message: 'success' };

  nock('http://localhost:5001')
    .get('/test-path')
    .query(queryParams)
    .reply(200, stubbedResponse);

  const requestAction = {
    type: 'TEST',
    method: 'GET',
    url: 'http://localhost:5001/test-path',
    qs: queryParams
  };
  const actionObj = {
    [CALL_API]: requestAction
  };

  const expectedAction = {
    id: undefined,
    config: configureRequest(requestAction),
    type: 'TEST',
    data: stubbedResponse
  };

  const actionHandler = t.context.nextHandler(action => {
    t.deepEqual(action, expectedAction);
    t.end();
  });

  actionHandler(actionObj);
});

test.cb('should return expected action for POST request action', (t) => {
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
    config: configureRequest(requestAction),
    type: 'TEST',
    data: requestBody
  };

  const actionHandler = t.context.nextHandler(action => {
    t.deepEqual(action, expectedAction);
    t.end();
  });

  actionHandler(actionObj);
});

test.cb('should return expected action for PUT request action', (t) => {
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
    config: configureRequest(requestAction),
    type: 'TEST',
    data: requestBody
  };

  const actionHandler = t.context.nextHandler(action => {
    t.deepEqual(action, expectedAction);
    t.end();
  });

  actionHandler(actionObj);
});

test.cb('should return expected action for DELETE request action', (t) => {
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
    config: configureRequest(requestAction),
    type: 'TEST',
    data: stubbedResponse
  };

  const actionHandler = t.context.nextHandler(action => {
    t.deepEqual(action, expectedAction);
    t.end();
  });

  actionHandler(actionObj);
});
