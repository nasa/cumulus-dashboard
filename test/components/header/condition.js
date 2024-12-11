'use strict';

import test from 'ava';
import { render, screen } from '@testing-library/react'
import { Header } from '../../../app/src/js/components/Header/header';
import { Provider } from 'react-redux'
import { requestMiddleware } from '../../../app/src/js/middleware/request.js';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

const locationQueryParams = { search: {} };
const dispatch = () => {};
const middlewares = [requestMiddleware, thunk];
const mockStore = configureMockStore(middlewares);
const someStore = mockStore({
   getState: () => {},
   subscribe: () => {},
   timer: { running: false, seconds: -1 },
   locationQueryParams,
   dispatch
  });

test('Header should include PDRs and Logs in navigation when HIDE_PDR=false and KIBANAROOT has value', function (t) {
  const query = {};
  const dispatch = () => {};
  const api = {
    authenticated: true,
  };
  const location = {
    pathname: '/',
  };
  const locationQueryParams = {
    search: {}
  };

  const { container } = render(
    <Provider store={someStore}>
      <Header
        dispatch={dispatch}
        api={api}
        location={location}
        locationQueryParams={locationQueryParams}
        defaultQuery={query}
      />
    </Provider>);

  const navigation = screen.findByText('nav li')
  t.is(navigation.length, 11);
  t.truthy(screen.findByText('PDRs'));
  t.truthy(screen.findByText('Logs'));

});

test('Logo path includes BUCKET env variable', function (t) {
  const dispatch = () => {};
  const api = {
    authenticated: true,
  };
  const location = {
    pathname: '/',
  };
  const locationQueryParams = {
    search: {}
  };

  const { container } = render(
    <Provider store={someStore}>
      <Header
        dispatch={dispatch}
        api={api}
        location={location}
        locationQueryParams={locationQueryParams}
        defaultQuery={query}
      />
    </Provider>);

  const logo = screen.findByText('img[alt="Logo"]')
  t.is(logo.length, 1);
  t.truthy(screen.findByText('https://example.com/bucket/cumulus-logo.png'));

});
