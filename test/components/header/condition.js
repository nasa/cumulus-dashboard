'use strict';

import test from 'ava';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import React from 'react';
import { shallow, configure } from 'enzyme';

import { Header } from '../../../app/src/js/components/Header/header';

configure({ adapter: new Adapter() });

test('Header should include PDRs and Logs in navigation when HIDE_PDR=false and KIBANAROOT has value', function (t) {
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

  const header = shallow(
    <Header
      dispatch={dispatch}
      api={api}
      location={location}
      locationQueryParams={locationQueryParams}
    />
  );

  const navigation = header.find('nav li');
  t.is(navigation.length, 11);
  t.is(navigation.contains('PDRs'), true);
  t.is(navigation.contains('Logs'), true);
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

  const header = shallow(
    <Header
      dispatch={dispatch}
      api={api}
      location={location}
      locationQueryParams={locationQueryParams}
    />
  );

  const logo = header.find('img[alt="Logo"]');
  t.is(logo.props().src, 'https://example.com/bucket/cumulus-logo.png');
});
