import test from 'ava';
import React from 'react';
import { Provider } from 'react-redux';
import { render, screen, act } from '@testing-library/react';
import sinon from 'sinon';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { requestMiddleware } from '../../../app/src/js/middleware/request';
import jwt from 'jsonwebtoken';
import SessionTimeoutModal from '../../../app/src/js/components/SessionTimeoutModal/session-timeout-modal';

const middlewares = [requestMiddleware, thunk];
const mockStore = configureMockStore(middlewares);

function createDummyToken(expiration) {
  return jwt.sign({ exp: expiration }, '', { algorithm: 'none' });
}

let clock;

test.before(() => {
  clock = sinon.useFakeTimers();
});

test.after.always(() => {
  clock.restore();
});

test('SessionTimeout modal shows up 5 minutes before token expiration', async (t) => {
  const futureExp = Math.floor(Date.now() / 1000) + 400; // expires in 400 seconds
  const dummyToken = createDummyToken(futureExp);

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

  await act(async () => {
    clock.tick(100000); // fast-forwards a 100 seconds, to within 5 minutes of expiration
    await Promise.resolve();
  });

  const modalText = screen.getByText(/Your session will expire in 5 minutes/);
  t.truthy(modalText);

  const logoutButton = screen.getByRole('button', { name: /Dismiss/i });
  const closeButton = screen.getByRole('button', { name: /Refresh/i });

  t.truthy(logoutButton);
  t.truthy(closeButton);
});
