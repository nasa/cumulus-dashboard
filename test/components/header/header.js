'use strict';

import test from 'ava';
import { render, screen } from '@testing-library/react'
import React from 'react';

import { Header } from '../../../app/src/js/components/Header/header';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { requestMiddleware } from '../../../app/src/js/middleware/request';

const middlewares = [requestMiddleware, thunk];
const mockStore = configureMockStore(middlewares);
const dispatch = () => {};
const initialState = {
  api: { authenticated: true },
  locationQueryParams: { search: {} },
  apiVersion : {
    versionNumber: '1.11.0',
    warning: '',
    isCompatible: true
  },
  cmrInfo: {
    cmrEnv: 'UAT',
    cmrProvider: 'CUMULUS',
    cmrOauthProvider: 'Launchpad'
  }
};

test('Header contains correct number of nav items and excludes PDRs and Logs', function (t) {
  const api = {
    authenticated: true
  }
  const location = {
    pathname: '/'
  }
  const locationQueryParams = {
    search: {}
  };

  const someStore = mockStore(initialState);
  const { container } = render(
    <Provider store={someStore} >
    <MemoryRouter>
    <Header
      dispatch={dispatch}
      api={api}
      location={location}
      locationQueryParams={locationQueryParams}
    />
    </MemoryRouter>
    </Provider>
  );

  const navigation = header.find('nav li');
  t.is(navigation.length, 9);
  t.is(navigation.contains('PDRs'), false);
  t.is(navigation.contains('Logs'), false);
});


test('Logo path is "/cumulus-logo.png" when BUCKET is not specified', function (t) {
  const dispatch = () => {};
  const api = {
    authenticated: true
  }
  const location = {
    pathname: '/'
  }
  const locationQueryParams = {
    search: {}
  };

  const { header } = render(
    <Header
      dispatch={dispatch}
      api={api}
      location={location}
      locationQueryParams={locationQueryParams}
    />
  );

  const logo = header.find('img[alt="Logo"]');
  t.is(logo.props().src, "/cumulus-logo.png");
});