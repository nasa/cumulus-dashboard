'use strict';

import test from 'ava';
import React from 'react';
import { OAuth } from '../../../app/src/js/components/oauth';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { requestMiddleware } from '../../../app/src/js/middleware/request';

const middlewares = [requestMiddleware, thunk];
const mockStore = configureMockStore(middlewares);
const initialState = {
  api: {
    authenticated: false,
    inflight: false,
  },
  location: {
    pathname: '/'
  },
  queryParams: {}
};

test('OAuth has link to Earthdata by default', function (t) {
  const dispatch = () => {};
  const api = {
    authenticated: false,
    inflight: false,
  }
  const location = {
    pathname: '/',
    search:'',
  }

  const urlHelper = {
    location,
    historyPushWithQueryParams: () => {}
  };

  const someStore = mockStore(initialState);
  render(
    <Provider store={someStore} >
    <MemoryRouter>
    <OAuth
      dispatch={dispatch}
      api={api}
      location={location}
      queryParams={{}}
      urlHelper={urlHelper}
    />
    </MemoryRouter>
    </Provider>
  );

  const appTarget = screen.getAllByRole('link');
  t.is(appTarget.length, 1);

  t.regex(appTarget[0].getAttribute('href'), /token\?state/);
  t.regex(appTarget[0].textContent, /Earthdata/);
});