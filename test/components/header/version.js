'use strict';

import test from 'ava';
import Adapter from 'enzyme-adapter-react-15';
import React from 'react';
import { shallow, configure } from 'enzyme';

import Header from '../../../app/scripts/components/app/header.js';

configure({ adapter: new Adapter() });

test('Cumulus API Version is shown on the dashboard', function (t) {
  const location = {
    pathname: '/some-path'
  };
  const dispatch = () => {};
  const api = {};
  const apiVersion = {
    versionNumber: '1.11.0',
    warning: '',
    isCompatible: true
  };

  const headerWrapper = shallow(<Header
    dispatch={dispatch}
    api={api}
    apiVersion={apiVersion}
    location={location}/>);

  const apiVersionNumber = headerWrapper.find('[className="apiVersion"]');
  t.is(`Cumulus API Version: ${apiVersion.versionNumber}`, apiVersionNumber.text());
  const hasApiWarning = headerWrapper.hasClass('apiVersionWarning');
  t.false(hasApiWarning);
});

test('Warning is shown when Cumulus API Version is not compatible with dashboard', function (t) {
  const location = {
    pathname: '/some-path'
  };
  const dispatch = () => {};
  const api = {};
  const apiVersion = {
    versionNumber: '1.0.0',
    warning: 'This is a warning',
    isCompatible: false
  };

  const headerWrapper = shallow(<Header
    dispatch={dispatch}
    api={api}
    apiVersion={apiVersion}
    location={location}/>);

  const apiWarning = headerWrapper.find('[className="apiVersionWarning"]');
  const hasApiWarning = apiWarning.hasClass('apiVersionWarning');
  t.true(hasApiWarning);
  t.is(`Warning: ${apiVersion.warning}`, apiWarning.text());
});
