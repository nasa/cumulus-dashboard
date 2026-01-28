import test from 'ava';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import jwt from 'jsonwebtoken';
import { requestMiddleware } from '../../app/src/js/middleware/request';
import { logout, deleteToken, loginError, refreshAccessToken } from '../../app/src/js/actions';
import { getSessionStart } from '../../app/src/js/utils/auth';
import * as types from '../../app/src/js/actions/types';
import _config from '../../app/src/js/config';

const middlewares = [requestMiddleware, thunk];
const mockStore = configureMockStore(middlewares);

function createDummyToken(iat) {
  return jwt.sign({ iat }, '', { algorithm: 'none' });
}

test.beforeEach(() => {
  nock.cleanAll();
});

test.afterEach(() => {
  nock.cleanAll();
});

test('logout action dispatches correct actions', async (t) => {
  // Mock the tokenDelete endpoint
  nock('https://example.com')
    .delete(/tokenDelete/)
    .reply(200);
  
  const store = mockStore({
    api: {
      tokens: {
        token: 'test-token'
      }
    }
  });
  
  await store.dispatch(logout());
  
  const actions = store.getActions();
  t.true(actions.some(action => action.type === types.DELETE_TOKEN));
  t.true(actions.some(action => action.type === types.LOGOUT));
});

test('deleteToken action dispatches correct action', async (t) => {
  // Mock the tokenDelete endpoint
  nock('https://example.com')
    .delete(/tokenDelete/)
    .reply(200);
  
  const store = mockStore({
    api: {
      tokens: {
        token: 'test-token'
      }
    }
  });
  
  await store.dispatch(deleteToken());
  
  const actions = store.getActions();
  t.true(actions.some(action => action.type === types.DELETE_TOKEN));
});

test('loginError dispatches correct actions', async (t) => {
  // Mock the tokenDelete endpoint
  nock('https://example.com')
    .delete(/tokenDelete/)
    .reply(200);
  
  const store = mockStore({
    api: {
      tokens: {
        token: 'test-token'
      }
    }
  });
  
  await store.dispatch(loginError(new Error('Test error')));
  
  const actions = store.getActions();
  t.true(actions.some(action => action.type === types.DELETE_TOKEN));
  t.true(actions.some(action => action.type === 'LOGIN_ERROR'));
});

test('getSessionStart returns iat from token', (t) => {
  const iatSeconds = Math.floor(Date.now() / 1000);
  const token = createDummyToken(iatSeconds);
  
  const sessionStart = getSessionStart(token);
  t.is(sessionStart, iatSeconds * 1000);
});

test('token refresh with preserved iat maintains session start', (t) => {
  // Original token issued 2 hours ago
  const originalIat = Math.floor(Date.now() / 1000) - (2 * 60 * 60);
  const oldToken = createDummyToken(originalIat);
  
  // New token with same iat (backend preserves it)
  const newToken = createDummyToken(originalIat);
  
  const sessionStartOld = getSessionStart(oldToken);
  const sessionStartNew = getSessionStart(newToken);
  
  // Both should have the same session start
  t.is(sessionStartOld, sessionStartNew);
  t.is(sessionStartOld, originalIat * 1000);
});

test('refreshAccessToken rejects when session exceeds 12 hours', async (t) => {
  // Create a token with iat from 13 hours ago
  const oldIat = Math.floor(Date.now() / 1000) - (13 * 60 * 60);
  const oldToken = createDummyToken(oldIat);
  
  const store = mockStore({
    api: {
      tokens: {
        token: oldToken
      }
    }
  });
  
  try {
    await store.dispatch(refreshAccessToken(oldToken));
    t.fail('Should have rejected');
  } catch (error) {
    t.true(error.message.includes('12 hours'));
  }
  
  const actions = store.getActions();
  t.true(actions.some(action => action.type === types.REFRESH_TOKEN_ERROR));
});
