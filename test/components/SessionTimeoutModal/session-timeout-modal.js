import test from 'ava';
import React from 'react';
import { Provider } from 'react-redux';
import { render, screen, act, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { requestMiddleware } from '../../../app/src/js/middleware/request';
import jwt from 'jsonwebtoken';
import nock from 'nock';
import SessionTimeoutModal from '../../../app/src/js/components/SessionTimeoutModal/session-timeout-modal';
const middlewares = [requestMiddleware, thunk];
const mockStore = configureMockStore(middlewares);

function createDummyToken(expiration, iat) {
  const payload = { exp: expiration };
  if (iat !== undefined) {
    payload.iat = iat;
  }
  return jwt.sign(payload, '', { algorithm: 'none' });
}

let clock;

test.before(() => {
  clock = sinon.useFakeTimers();
});

test.afterEach(() => {
  nock.cleanAll();
});

test.after.always(() => {
  clock.restore();
});

test('SessionTimeout modal does NOT show when token expiring if session cap not reached', async (t) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const futureExp = currentTime + 400; // expires in 400 seconds
  const iat = currentTime - 3600; // issued 1 hour ago (within 12-hour cap)
  const dummyToken = createDummyToken(futureExp, iat);

  nock('https://example.com')
    .post('/refresh')
    .reply(200, { token: createDummyToken(currentTime + 3600, iat) });

  const store = mockStore({
    api: {
      tokens: { token: dummyToken },
    },
  });

  render(
    <Provider store={store}>
      <SessionTimeoutModal />
    </Provider>
  );

  t.falsy(screen.queryByText('Your session will expire in 5 minutes'));

  // Advance time to token expiration warning (5 minutes before expiration)
  await act(async () => {
    clock.tick(100000); // fast-forwards to within 5 minutes of expiration
    await Promise.resolve();
  });

  // Wait for auto-refresh to happen
  await act(async () => {
    clock.tick(2000);
    await Promise.resolve();
  });

  // Modal should NOT appear because token was auto-refreshed
  t.falsy(screen.queryByText('Your session will expire in 5 minutes'));
  
  // Verify refresh was called
  const actions = store.getActions();
  const refreshAction = actions.find(action => action.type === 'REFRESH_TOKEN_INFLIGHT');
  t.truthy(refreshAction);
});

test('SessionTimeout modal automatically refreshes token when session cap not reached', async (t) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const futureExp = currentTime + 400; // expires in 400 seconds
  const iat = currentTime - 3600; // issued 1 hour ago
  const dummyToken = createDummyToken(futureExp, iat);
  
  // New token with same iat (backend preserves it)
  const newToken = createDummyToken(currentTime + 3600, iat);

  // Mock the refresh endpoint
  nock('https://example.com')
    .post('/refresh')
    .reply(200, { token: newToken });

  const store = mockStore({
    api: {
      tokens: { token: dummyToken },
    },
  });

  render(
    <Provider store={store}>
      <SessionTimeoutModal />
    </Provider>
  );

  t.falsy(screen.queryByText('Your session will expire in 5 minutes'));

  // Advance time to within 5 minutes of expiration
  await act(async () => {
    clock.tick(80000); // Advance to within warning threshold
    await Promise.resolve();
  });

  // Wait for refresh to be attempted
  await act(async () => {
    clock.tick(2000);
    await Promise.resolve();
  });

  // Modal should NOT appear because token was refreshed automatically
  await waitFor(() => {
    t.falsy(screen.queryByText('Your session will expire in 5 minutes'));
  }, { timeout: 1000 });

  // Verify that refresh action was dispatched
  const actions = store.getActions();
  const refreshAction = actions.find(action => action.type === 'REFRESH_TOKEN_INFLIGHT');
  t.truthy(refreshAction);
});

test('SessionTimeout modal shows when session cap reached and token still valid', async (t) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const futureExp = currentTime + 400; // expires in 400 seconds (still valid)
  const iat = currentTime - (13 * 60 * 60); // issued 13 hours ago (exceeds 12 hour cap)
  const dummyToken = createDummyToken(futureExp, iat);

  const store = mockStore({
    api: {
      tokens: { token: dummyToken },
    },
  });

  render(
    <Provider store={store}>
      <SessionTimeoutModal />
    </Provider>
  );

  // Advance time to within 5 minutes of expiration (but not expired)
  await act(async () => {
    clock.tick(100000);
    await Promise.resolve();
  });

  // Modal should appear because session cap is reached but token still valid
  const modalText = screen.getByText(/Your session will expire in 5 minutes/);
  t.truthy(modalText);
});

test('Logs out immediately when session cap reached and token expired', async (t) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const pastExp = currentTime - 10; // token already expired
  const iat = currentTime - (13 * 60 * 60); // issued 13 hours ago (exceeds 12 hour cap)
  const dummyToken = createDummyToken(pastExp, iat);

  const store = mockStore({
    api: {
      tokens: { token: dummyToken },
    },
  });

  render(
    <Provider store={store}>
      <SessionTimeoutModal />
    </Provider>
  );

  // Wait for the interval to check and trigger logout
  await act(async () => {
    clock.tick(2000);
    await Promise.resolve();
  });

  // Modal should NOT appear - user should be logged out
  t.falsy(screen.queryByText(/Your session will expire in 5 minutes/));
  
  // Verify logout action was dispatched
  const actions = store.getActions();
  const logoutAction = actions.find(action => action.type === 'DELETE_TOKEN' || action.type === 'LOGOUT');
  t.truthy(logoutAction, 'Logout action should be dispatched');
});

test('User clicks "Re-login" button triggers logout', async (t) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const futureExp = currentTime + 400; // expires in 400 seconds (still valid)
  const iat = currentTime - (13 * 60 * 60); // issued 13 hours ago (exceeds 12 hour cap)
  const dummyToken = createDummyToken(futureExp, iat);

  const store = mockStore({
    api: {
      tokens: { token: dummyToken },
    },
  });

  render(
    <Provider store={store}>
      <SessionTimeoutModal />
    </Provider>
  );

  // Advance time to within 5 minutes of expiration
  await act(async () => {
    clock.tick(100000);
    await Promise.resolve();
  });

  // Modal should appear
  const reloginButton = screen.getByText('Re-login');
  t.truthy(reloginButton);

  // Click the Re-login button
  await act(async () => {
    reloginButton.click();
    await Promise.resolve();
  });

  // Verify logout action was dispatched
  const actions = store.getActions();
  const logoutAction = actions.find(action => action.type === 'LOGOUT');
  t.truthy(logoutAction, 'Logout action should be dispatched when Re-login clicked');
});

test('User clicks "Dismiss" button closes modal', async (t) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const futureExp = currentTime + 400; // expires in 400 seconds (still valid)
  const iat = currentTime - (13 * 60 * 60); // issued 13 hours ago (exceeds 12 hour cap)
  const dummyToken = createDummyToken(futureExp, iat);

  const store = mockStore({
    api: {
      tokens: { token: dummyToken },
    },
  });

  render(
    <Provider store={store}>
      <SessionTimeoutModal />
    </Provider>
  );

  // Advance time to within 5 minutes of expiration
  await act(async () => {
    clock.tick(100000);
    await Promise.resolve();
  });

  // Modal should appear
  t.truthy(screen.getByText(/Your session will expire in 5 minutes/));

  // Click the Dismiss button
  const dismissButton = screen.getByText('Dismiss');
  await act(async () => {
    dismissButton.click();
    await Promise.resolve();
  });

  // Modal should be closed
  await act(async () => {
    clock.tick(100);
    await Promise.resolve();
  });

  t.falsy(screen.queryByText(/Your session will expire in 5 minutes/));
  
  // Logout should NOT have been triggered
  const actions = store.getActions();
  const logoutAction = actions.find(action => action.type === 'LOGOUT');
  t.falsy(logoutAction, 'Logout should not be triggered when dismissed');
});

test('Modal does not reappear after dismissal during same warning period', async (t) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const futureExp = currentTime + 400; // expires in 400 seconds
  const iat = currentTime - (13 * 60 * 60); // issued 13 hours ago
  const dummyToken = createDummyToken(futureExp, iat);

  const store = mockStore({
    api: {
      tokens: { token: dummyToken },
    },
  });

  render(
    <Provider store={store}>
      <SessionTimeoutModal />
    </Provider>
  );

  // Advance time to within 5 minutes of expiration
  await act(async () => {
    clock.tick(100000);
    await Promise.resolve();
  });

  // Modal should appear
  t.truthy(screen.getByText(/Your session will expire in 5 minutes/));

  // Dismiss the modal
  const dismissButton = screen.getByText('Dismiss');
  await act(async () => {
    dismissButton.click();
    await Promise.resolve();
  });

  // Wait a bit longer (still within warning period)
  await act(async () => {
    clock.tick(30000); // 30 more seconds
    await Promise.resolve();
  });

  // Modal should not reappear (modalClosed flag prevents it)
  t.falsy(screen.queryByText(/Your session will expire in 5 minutes/));
});
