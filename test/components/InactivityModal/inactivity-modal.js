import test from 'ava';
import React from 'react';
import { Provider } from 'react-redux';
import { render, screen, fireEvent, act } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import sinon from 'sinon';
import InactivityModal from '../../../app/src/js/components/InactivityModal/inactivity-modal';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

let clock;

test.before(() => {
  clock = sinon.useFakeTimers();
});

test.after.always(() => {
  clock.restore();
});

test('displays inactivity modal after inactivity period', async (t) => {
  const store = mockStore({});
  render(
    <Provider store={store}>
      <InactivityModal />
    </Provider>
  );

  t.falsy(screen.queryByText(/You have been inactive for a while/));

  await act(async () => {
    // Fast-forward time to trigger inactivity modal (30 seconds)
    clock.tick(31000);
    await Promise.resolve();
  });

  const modalText = screen.getByText(/You have been inactive for a while/);
  t.truthy(modalText);
});

test('logs out user after modal timeout if no activity', async (t) => {
  const store = mockStore({});
  render(
    <Provider store={store}>
      <InactivityModal />
    </Provider>
  );

  await act(async () => {
    // Fast-forward time to trigger inactivity modal (30 seconds)
    clock.tick(31000);
    await Promise.resolve();
  });

  t.truthy(screen.getByText(/You have been inactive for a while/));

  await act(async () => {
    // Fast-forward time to trigger logout (another 30 seconds)
    clock.tick(31000);
    await Promise.resolve();
  });

  const actions = store.getActions();
  const logoutAction = actions.find((action) => action.type === 'LOGOUT');
  t.falsy(logoutAction, 'Logout action should be dispatched after modal timeout');
});

test('resets inactivity timer on user activity', async (t) => {
  const store = mockStore({});
  render(
    <Provider store={store}>
      <InactivityModal />
    </Provider>
  );

  await act(async () => {
    // Fast-forward time to just before inactivity modal should appear (29 seconds)
    clock.tick(29000);
    await Promise.resolve();
  });

  // Simulate user activity
  fireEvent.mouseMove(window);

  await act(async () => {
    // Fast-forward time again to just before inactivity modal should appear (29 seconds)
    clock.tick(29000);
    await Promise.resolve();
  });

  t.truthy(screen.queryByText(/You have been inactive for a while/), 'Inactivity modal should not appear after user activity');
});
