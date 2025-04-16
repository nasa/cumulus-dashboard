import test from 'ava';
import React from 'react';
import { Provider } from 'react-redux';
import { render, screen, act, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import thunk from 'redux-thunk';
import { requestMiddleware } from '../../../app/src/js/middleware/request';
import configureMockStore from 'redux-mock-store';
import * as jwt from 'jsonwebtoken';
import LaunchpadExpirationWarningModal from '../../../app/src/js/components/InactivityModal/inactivity-modal';

const middlewares = [requestMiddleware, thunk];
const mockStore = configureMockStore(middlewares);

let clock;

test.beforeEach(t => {
  clock = sinon.useFakeTimers();
  jwt.decode = sinon.stub().returns({
    exp: Math.floor(Date.now() / 1000) + 95, // Token will expire in 95 seconds
  });
});

test.afterEach.always(t => {
  clock.restore();
});

test('modal shows up when token is close to expiring', async (t) => {
  const expiration = Math.floor(Date.now() / 1000) + 95;

  jwt.decode = sinon.stub().returns({ exp: expiration });

  const store = mockStore({
    api: {
      tokens: {
        token: 'dummy.jwt.token',
      },
    },
    session: {
      tokenExpiration: expiration,
    },
  });

  const { container } = render(
    <Provider store={store}>
      <LaunchpadExpirationWarningModal />
    </Provider>
  );

  t.falsy(container.textContent.includes('Your session will expire in about 5 minutes'));

  await act(() => {
    clock.tick(96000);
    return Promise.resolve();
  });

  const content = container.textContent;
  console.log('Modal content after time tick:', content);
  console.log('Rendered HTML:', container.innerHTML);

  t.true(content.includes('Your session will expire in about 5 minutes'));
});
