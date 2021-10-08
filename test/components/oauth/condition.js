'use strict';

import test from 'ava';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import React from 'react';
import { shallow, configure } from 'enzyme';

import { OAuth } from '../../../app/src/js/components/oauth';

configure({ adapter: new Adapter() });

test('OAuth has link to Launchpad when AUTH_METHOD="launchpad"', function (t) {
  const dispatch = () => {};
  const api = {
    authenticated: false,
    inflight: false,
  }
  const location = {
    pathname: '/'
  }

  const header = shallow(
    <OAuth
      dispatch={dispatch}
      api={api}
      location={location}
      queryParams={{}}
    />
  );

  const loginButton = header.find('.button--oauth');
  t.is(loginButton.length, 1);
  t.regex(loginButton.props().href, /saml\/login\?RelayState/);
  t.regex(loginButton.text(), /Launchpad/);
});
