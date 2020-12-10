import test from 'ava';
import nock from 'nock';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { CALL_API } from '../../app/src/js/actions/types';
import { requestMiddleware } from '../../app/src/js/middleware/request';

const middlewares = [
  requestMiddleware,
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
  t.context.defaultConfig = {};

  t.context.expectedHeaders = {
    Authorization: 'Bearer fake-token',
    'Content-Type': 'application/json'
  };

  store.clearActions();
});

test.serial('dispatches TYPE_INFLIGHT and TYPE actions for API request action', async (t) => {
  const stubbedResponse = { test: 'test' };

  nock(`https://example.com`)
    .get('/test-path')
    .reply(200, stubbedResponse);

  const requestAction = {
    type: 'TEST',
    method: 'GET',
    url: `https://example.com/test-path`
  };
  const actionObj = {
    [CALL_API]: requestAction
  };

  return store.dispatch(actionObj).then(() => {
    const expectedActions = [{
      id: undefined,
      type: 'TEST_INFLIGHT',
      config: {
        ...t.context.defaultConfig,
        ...requestAction,
        headers: t.context.expectedHeaders,
      }
    }, {
      id: undefined,
      type: 'TEST',
      config: {
        ...t.context.defaultConfig,
        ...requestAction,
        headers: t.context.expectedHeaders,
      },
      data: stubbedResponse
    }];

    t.deepEqual(store.getActions(), expectedActions);
  });
});
