import test from 'ava';
import nock from 'nock';

import { CALL_API } from '../../app/src/js/actions/types';
import { requestMiddleware } from '../../app/src/js/middleware/request';

const port = process.env.FAKEAPIPORT || 5001;

test.beforeEach((t) => {
  const doDispatch = () => {};
  const doGetState = () => ({
    api: {
      tokens: {
        token: 'fake-token'
      }
    }
  });
  t.context.nextHandler = requestMiddleware({dispatch: doDispatch, getState: doGetState});

  t.context.defaultConfig = {
    json: true,
    resolveWithFullResponse: true,
    simple: false
  };

  t.context.expectedHeaders = {
    Authorization: 'Bearer fake-token',
    'Content-Type': 'application/json'
  };
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

test.cb('should add correct authorization headers to API request action', (t) => {
  nock(`http://localhost:${port}`, {
    reqheaders: {
      'Authorization': 'Bearer fake-token'
    }
  })
    .get('/test-path')
    .reply(200);

  const requestAction = {
    type: 'TEST',
    method: 'GET',
    url: `http://localhost:${port}/test-path`
  };
  const actionObj = {
    [CALL_API]: requestAction
  };

  const actionHandler = t.context.nextHandler(action => {
    t.deepEqual(action.config.headers.Authorization, 'Bearer fake-token');
    t.end();
  });

  actionHandler(actionObj);
});

test.cb('should be able to use provided authorization headers', (t) => {
  nock(`http://localhost:${port}`, {
    reqheaders: {
      'Authorization': 'Bearer another-token'
    }
  })
    .get('/test-path')
    .reply(200);

  const requestAction = {
    type: 'TEST',
    method: 'GET',
    url: `http://localhost:${port}/test-path`,
    skipAuth: true,
    headers: {
      Authorization: 'Bearer another-token'
    }
  };
  const actionObj = {
    [CALL_API]: requestAction
  };

  const actionHandler = t.context.nextHandler(action => {
    t.deepEqual(action.config.headers.Authorization, 'Bearer another-token');
    t.end();
  });

  actionHandler(actionObj);
});

test.cb('should dispatch error action for failed request', (t) => {
  nock(`http://localhost:${port}`)
    .get('/test-path')
    .reply(500, { message: 'Internal server error' });

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

  const actionHandler = t.context.nextHandler(action => {
    t.deepEqual(action, expectedAction);
    t.end();
  });

  actionHandler(actionObj);
});

test.cb('should return expected action for GET request action', (t) => {
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

  const actionHandler = t.context.nextHandler(action => {
    t.deepEqual(action, expectedAction);
    t.end();
  });

  actionHandler(actionObj);
});

test.cb('should return expected action for POST request action', (t) => {
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

  const actionHandler = t.context.nextHandler(action => {
    t.deepEqual(action, expectedAction);
    t.end();
  });

  actionHandler(actionObj);
});

test.cb('should return expected action for PUT request action', (t) => {
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

  const actionHandler = t.context.nextHandler(action => {
    t.deepEqual(action, expectedAction);
    t.end();
  });

  actionHandler(actionObj);
});

test.cb('should return expected action for DELETE request action', (t) => {
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

  const actionHandler = t.context.nextHandler(action => {
    t.deepEqual(action, expectedAction);
    t.end();
  });

  actionHandler(actionObj);
});
