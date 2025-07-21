import test from 'ava';
import React from 'react';
import { Provider } from 'react-redux';
import { render, screen, act, cleanup } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import { requestMiddleware } from '../../../app/src/js/middleware/request';
import thunk from 'redux-thunk';
import sinon from 'sinon';
import InactivityModal, { INACTIVITY_LIMIT, MODAL_TIMEOUT } from '../../../app/src/js/components/InactivityModal/inactivity-modal';

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
    clock.tick(INACTIVITY_LIMIT); // fast-forward to inactivity limit
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
    clock.tick(INACTIVITY_LIMIT); // fast-forward to inactivity limit
    await Promise.resolve();
  });

  t.truthy(screen.queryByText(/You have been inactive for a while/));

  // Simulate user activity
  await act(async () => {
    window.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
    clock.tick(0);
    await Promise.resolve();
  });

  await act(() => Promise.resolve());

  t.falsy(screen.queryByTestId('inactivity-modal'));
});
test('modal hides as logout runs after modal timeout', async (t) => {
  const store = mockStore({ api: { tokens: { token: 'dummy' } } });

  render(
    <Provider store={store}>
      <InactivityModal />
    </Provider>
  );
  await act(async () => {
    clock.tick(INACTIVITY_LIMIT); // fast-forward to inactivity limit
    await Promise.resolve();
  });
  t.truthy(screen.queryByText(/You have been inactive for a while/));
  await act(async () => {
    clock.tick(MODAL_TIMEOUT); // fast-forward to modal timeout
    await Promise.resolve();
  });
  t.falsy(screen.queryByTestId('inactivity-modal'));
});
