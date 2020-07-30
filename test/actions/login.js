import test from 'ava';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { requestMiddleware } from '../../app/src/js/middleware/request';

const actions = require('../../app/src/js/actions');

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
  store.clearActions();
});

test.serial('loginError action creator dispatches DELETE_TOKEN and LOGIN_ERROR actions', async (t) => {
  const error = 'fail';

  return store.dispatch(actions.loginError(error)).then(() => {
    const dispatchedActions = store.getActions();
    const expectedActions = [{
      type: 'DELETE_TOKEN'
    }, {
      type: 'LOGIN_ERROR',
      error
    }];
    t.deepEqual(dispatchedActions, expectedActions);
  });
});
