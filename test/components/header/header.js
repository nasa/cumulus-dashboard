'use strict';

import test from 'ava';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import React from 'react';
import { shallow, configure } from 'enzyme';

import { Header } from '../../../app/src/js/components/Header/header';

configure({ adapter: new Adapter() });

test('Header contains correct number of nav items and excludes PDRs and Logs', function (t) {
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

  const header = shallow(
    <Header
      dispatch={dispatch}
      api={api}
      location={location}
      locationQueryParams={locationQueryParams}
    />
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

  const header = shallow(
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