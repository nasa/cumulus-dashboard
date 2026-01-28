import test from 'ava';
import React from 'react';
import { Provider } from 'react-redux';
import { render, screen, act, cleanup } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import { requestMiddleware } from '../../../app/src/js/middleware/request';
import thunk from 'redux-thunk';
import sinon from 'sinon';
import InactivityModal from '../../../app/src/js/components/InactivityModal/inactivity-modal';
import _config from '../../../app/src/js/config';

const middlewares = [requestMiddleware, thunk];
const mockStore = configureMockStore(middlewares);

let clock;

test.before(() => {
  clock = sinon.useFakeTimers();
});

test.after.always(() => {
  clock.restore();
  cleanup();
});

test('modal is displayed after inactivity timeout', async (t) => {
  const store = mockStore({ api: { tokens: { token: 'dummy' } } });

  render(
    <Provider store={store}>
      <InactivityModal />
    </Provider>
  );

  t.falsy(screen.queryByText(/You have been inactive for a while/));

  await act(async () => {
    clock.tick(_config.inactivityWarningLimit + 1000); // fast-forward past warning limit
    await Promise.resolve();
  });

  t.truthy(screen.queryByText(/You have been inactive for a while/));
});

test('modal closes on user activity', async (t) => {
  const store = mockStore({ api: { tokens: { token: 'dummy' } } });

  render(
    <Provider store={store}>
      <InactivityModal dispatch={store.dispatch}/>
    </Provider>
  );

  await act(async () => {
    clock.tick(_config.inactivityWarningLimit + 1000); // fast-forward past warning limit
    await Promise.resolve();
  });

  t.truthy(screen.queryByText(/You have been inactive for a while/));

  // Simulate user activity
  await act(async () => {
    window.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
    clock.tick(100);
    await Promise.resolve();
  });

  await act(() => Promise.resolve());

  t.falsy(screen.queryByText(/You have been inactive for a while/));
});

test('logout is triggered after total inactivity timeout', async (t) => {
  const store = mockStore({ api: { tokens: { token: 'dummy' } } });

  render(
    <Provider store={store}>
      <InactivityModal />
    </Provider>
  );

  await act(async () => {
    clock.tick(_config.inactivityWarningLimit + 1000); // fast-forward past warning limit
    await Promise.resolve();
  });

  t.truthy(screen.queryByText(/You have been inactive for a while/));
  
  await act(async () => {
    clock.tick(_config.inactivityLogoutLimit - _config.inactivityWarningLimit + 1000); // fast-forward to logout
    await Promise.resolve();
  });

  // Verify logout action was dispatched
  const actions = store.getActions();
  const logoutAction = actions.find(action => action.type === 'DELETE_TOKEN');
  t.truthy(logoutAction);
});

test('modal closes when "Stay logged in" button is clicked', async (t) => {
  const store = mockStore({ api: { tokens: { token: 'dummy' } } });

  render(
    <Provider store={store}>
      <InactivityModal />
    </Provider>
  );

  await act(async () => {
    clock.tick(_config.inactivityWarningLimit + 1000); // fast-forward past warning limit
    await Promise.resolve();
  });

  t.truthy(screen.queryByText(/You have been inactive for a while/));
  
  // Click the "Stay logged in" button
  const stayLoggedInButton = screen.getByText('Stay logged in');
  t.truthy(stayLoggedInButton);
  
  await act(async () => {
    stayLoggedInButton.click();
    clock.tick(100);
    await Promise.resolve();
  });

  await act(() => Promise.resolve());

  t.falsy(screen.queryByText(/You have been inactive for a while/));
});
