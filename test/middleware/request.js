import test from 'ava';
import nock from 'nock';
import sinon from 'sinon';
import rewire from 'rewire';

import { CALL_API } from '../../app/src/js/actions/types';
const request = rewire('../../app/src/js/middleware/request');

const port = process.env.FAKEAPIPORT || 5001;
const token = 'fake-token';

const requestMiddleware = request.__get__('requestMiddleware');
const loginErrorStub = sinon.stub();
request.__set__('loginError', () => {
  loginErrorStub();
});

const getStateStub = sinon.stub().callsFake(() => ({
  api: {
    tokens: {
      token
    }
  }
}));
const dispatchStub = sinon.stub();
const nextStub = sinon.stub();

const create = () => {
  const store = {
    getState: getStateStub,
    dispatch: dispatchStub
  };
  const next = nextStub;

  const invokeMiddleware = action => requestMiddleware(store)(next)(action);

  return { store, next, invokeMiddleware };
};

test.beforeEach((t) => {
  t.context.defaultConfig = {
    json: true,
    resolveWithFullResponse: true,
    simple: false
  };

  t.context.expectedHeaders = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
});

test.afterEach.always(() => {
  nock.cleanAll();
  dispatchStub.resetHistory();
  getStateStub.resetHistory();
  nextStub.resetHistory();
  loginErrorStub.resetHistory();
});

test.serial('should pass action to next if not an API request action', (t) => {
  const actionObj = {};

  const { next, invokeMiddleware } = create();
  invokeMiddleware(actionObj);

  t.deepEqual(next.firstCall.args[0], actionObj);
});

test.serial('should throw error if no method is set on API request action', (t) => {
  const actionObj = {
    [CALL_API]: {}
  };

  const { invokeMiddleware } = create();

  t.throws(
    () => invokeMiddleware(actionObj),
    { message: 'Request action must include a method' }
  );
});

test.serial('should add correct authorization headers to API request action', async (t) => {
  const requestAction = {
    type: 'TEST',
    method: 'GET',
    url: 'http://any-url'
  };
  const actionObj = {
    [CALL_API]: requestAction
  };

  const requestPromiseStub = sinon.stub().resolves({
    body: {},
    statusCode: 200
  });
  const revertRequestStub = request.__set__('requestPromise', requestPromiseStub);

  try {
    const { invokeMiddleware } = create();

    await invokeMiddleware(actionObj);

    const nextAction = requestPromiseStub.firstCall.args[0];
    t.deepEqual(nextAction.headers.Authorization, 'Bearer fake-token');
  } finally {
    revertRequestStub();
  }
});

test.serial('should be able to use provided authorization headers', async (t) => {
  const requestAction = {
    type: 'TEST',
    method: 'GET',
    url: 'http://any-url',
    skipAuth: true,
    headers: {
      Authorization: 'Bearer another-token'
    }
  };
  const actionObj = {
    [CALL_API]: requestAction
  };

  const requestPromiseStub = sinon.stub().resolves({
    body: {},
    statusCode: 200
  });
  const revertRequestStub = request.__set__('requestPromise', requestPromiseStub);

  try {
    const { invokeMiddleware } = create();

    await invokeMiddleware(actionObj);

    const nextAction = requestPromiseStub.firstCall.args[0];
    t.deepEqual(nextAction.headers.Authorization, 'Bearer another-token');
  } finally {
    revertRequestStub();
  }
});

test.serial('should dispatch error action for failed request', async (t) => {
  nock(`http://localhost:${port}`)
    .get('/test-path')
    .reply(500, { message: 'Internal server error' });

  const { next, invokeMiddleware } = create();

  const requestAction = {
    type: 'TEST',
    method: 'GET',
    url: `http://localhost:${port}/test-path`
  };
  const actionObj = {
    [CALL_API]: requestAction
  };

  const expectedAction = {
    id: undefined,
    error: 'Internal server error',
    config: {
      ...t.context.defaultConfig,
      ...requestAction,
      headers: t.context.expectedHeaders
    },
    type: 'TEST_ERROR'
  };

  await invokeMiddleware(actionObj);
  t.deepEqual(next.firstCall.args[0], expectedAction);
});

test.serial('should dispatch login error action for 4xx response', async (t) => {
  nock(`http://localhost:${port}`)
    .get('/test-path')
    .reply(401, { message: 'Access denied' });

  const { invokeMiddleware } = create();

  const requestAction = {
    type: 'TEST',
    method: 'GET',
    url: `http://localhost:${port}/test-path`
  };
  const actionObj = {
    [CALL_API]: requestAction
  };

  await invokeMiddleware(actionObj);
  t.true(loginErrorStub.called);
});

test.serial('should return expected action for GET request action', async (t) => {
  const stubbedResponse = { message: 'success' };

  nock(`http://localhost:${port}`)
    .get('/test-path')
    .reply(200, stubbedResponse);

  const requestAction = {
    type: 'TEST',
    method: 'GET',
    url: `http://localhost:${port}/test-path`
  };
  const actionObj = {
    [CALL_API]: requestAction
  };

  const expectedAction = {
    id: undefined,
    config: {
      ...t.context.defaultConfig,
      ...requestAction,
      headers: t.context.expectedHeaders
    },
    type: 'TEST',
    data: stubbedResponse
  };

  const { next, invokeMiddleware } = create();

  await invokeMiddleware(actionObj);

  t.deepEqual(next.firstCall.args[0], expectedAction);
});

test.serial('should return expected action for GET request action with query state', async (t) => {
  const queryParams = {
    limit: 1,
    otherParam: 'value'
  };
  const stubbedResponse = { message: 'success' };

  nock(`http://localhost:${port}`)
    .get('/test-path')
    .query(queryParams)
    .reply(200, stubbedResponse);

  const requestAction = {
    type: 'TEST',
    method: 'GET',
    url: `http://localhost:${port}/test-path`,
    qs: queryParams
  };
  const actionObj = {
    [CALL_API]: requestAction
  };

  const expectedAction = {
    id: undefined,
    config: {
      ...t.context.defaultConfig,
      ...requestAction,
      headers: t.context.expectedHeaders
    },
    type: 'TEST',
    data: stubbedResponse
  };

  const { next, invokeMiddleware } = create();

  await invokeMiddleware(actionObj);

  t.deepEqual(next.firstCall.args[0], expectedAction);
});

test.serial('should return expected action for POST request action', async (t) => {
  nock(`http://localhost:${port}`)
    .post('/test-path')
    .reply(200, (_, requestBody) => {
      return requestBody;
    });

  const requestBody = { test: 'test' };
  const requestAction = {
    type: 'TEST',
    method: 'POST',
    url: `http://localhost:${port}/test-path`,
    body: requestBody
  };
  const actionObj = {
    [CALL_API]: requestAction
  };

  const expectedAction = {
    id: undefined,
    config: {
      ...t.context.defaultConfig,
      ...requestAction,
      headers: t.context.expectedHeaders
    },
    type: 'TEST',
    data: requestBody
  };

  const { next, invokeMiddleware } = create();

  await invokeMiddleware(actionObj);

  t.deepEqual(next.firstCall.args[0], expectedAction);
});

test.serial('should return expected action for PUT request action', async (t) => {
  nock(`http://localhost:${port}`)
    .put('/test-path')
    .reply(200, (_, requestBody) => {
      return requestBody;
    });

  const requestBody = { test: 'test' };
  const requestAction = {
    type: 'TEST',
    method: 'PUT',
    url: `http://localhost:${port}/test-path`,
    body: requestBody
  };
  const actionObj = {
    [CALL_API]: requestAction
  };

  const expectedAction = {
    id: undefined,
    config: {
      ...t.context.defaultConfig,
      ...requestAction,
      headers: t.context.expectedHeaders
    },
    type: 'TEST',
    data: requestBody
  };

  const { next, invokeMiddleware } = create();

  await invokeMiddleware(actionObj);

  t.deepEqual(next.firstCall.args[0], expectedAction);
});

test.serial('should return expected action for DELETE request action', async (t) => {
  const stubbedResponse = { message: 'success' };
  nock(`http://localhost:${port}`)
    .delete('/test-path')
    .reply(200, stubbedResponse);

  const requestAction = {
    type: 'TEST',
    method: 'DELETE',
    url: `http://localhost:${port}/test-path`
  };
  const actionObj = {
    [CALL_API]: requestAction
  };

  const expectedAction = {
    id: undefined,
    config: {
      ...t.context.defaultConfig,
      ...requestAction,
      headers: t.context.expectedHeaders
    },
    type: 'TEST',
    data: stubbedResponse
  };

  const { next, invokeMiddleware } = create();

  await invokeMiddleware(actionObj);

  t.deepEqual(next.firstCall.args[0], expectedAction);
});
