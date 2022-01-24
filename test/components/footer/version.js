'use strict';

import test from 'ava';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import React from 'react';
import { shallow, configure } from 'enzyme';

import Footer from '../../../app/src/js/components/Footer/footer.js';

const pckg = require('../../../package.json');

configure({ adapter: new Adapter() });

test('Cumulus API Version is not shown on the dashboard when not logged in', function (t) {
  const api = { };
  const apiVersion = {
    versionNumber: '1.11.0',
    warning: '',
    isCompatible: true
  };
  const cmrInfo = {
    cmrEnv: 'UAT',
    cmrProvider: 'CUMULUS',
    cmrOauthProvider: 'Launchpad'
  }

  const footerWrapper = shallow(
    <Footer
      api={api}
      apiVersion={apiVersion}
      cmrInfo={cmrInfo}
    />
  );

  t.false(footerWrapper.exists('.version__info'));
});

test('Cumulus API Version is shown on the dashboard', function (t) {
  const api = { authenticated: true };
  const apiVersion = {
    versionNumber: '1.11.0',
    warning: '',
    isCompatible: true
  };
  const cmrInfo = {
    cmrEnv: 'UAT',
    cmrProvider: 'CUMULUS',
    cmrOauthProvider: 'Launchpad'
  }

  const footerWrapper = shallow(
    <Footer
      api={api}
      apiVersion={apiVersion}
      cmrInfo={cmrInfo}
    />
  );

  const apiFooterSection = footerWrapper.find('[className="api__version"]');
  const apiVersionNumber = apiFooterSection.props().children.props.target;

  t.is(`API v${apiVersion.versionNumber}`, apiVersionNumber);
  const hasApiWarning = footerWrapper.hasClass('api__warning');
  t.false(hasApiWarning);
});

test('Warning is shown when Cumulus API Version is not compatible with dashboard', function (t) {
  const api = { authenticated: true };
  const apiVersion = {
    versionNumber: '1.0.0',
    warning: 'This is a warning',
    isCompatible: false
  };
  const cmrInfo = {
    cmrEnv: 'UAT',
    cmrProvider: 'CUMULUS',
    cmrOauthProvider: 'Launchpad'
  }

  const footerWrapper = shallow(
    <Footer
      api={api}
      apiVersion={apiVersion}
      cmrInfo={cmrInfo}
    />
  );

  const apiWarning = footerWrapper.find('[className="api__warning"]');
  const hasApiWarning = apiWarning.hasClass('api__warning');
  t.true(hasApiWarning);
  t.is(`Warning: ${apiVersion.warning}`, apiWarning.text());
});

test('Dashboard Version is shown in the footer', function (t) {
  const api = { authenticated: true };
  const apiVersion = {
    versionNumber: '1.11.0',
  };
  const cmrInfo = {
    cmrEnv: 'UAT',
    cmrProvider: 'CUMULUS',
    cmrOauthProvider: 'Launchpad'
  }
  const dashboardVersion = pckg.version;

  const footerWrapper = shallow(
    <Footer
      api={api}
      apiVersion={apiVersion}
      cmrInfo={cmrInfo}
    />
  );

  const dashboardVersionNumber = footerWrapper.find('[className="dashboard__version"]');
  t.is(`Dashboard v${dashboardVersion}`, dashboardVersionNumber.text());
});

test('FOIA, Privacy, and Feedback links shown in the footer', function (t) {
  const api = { authenticated: true };
  const apiVersion = {
    versionNumber: '1.11.0',
  };
  const cmrInfo = {
    cmrEnv: 'UAT',
    cmrProvider: 'CUMULUS',
    cmrOauthProvider: 'Launchpad'
  }
  const dashboardVersion = pckg.version;

  const footerWrapper = shallow(
    <Footer
      api={api}
      apiVersion={apiVersion}
      cmrInfo={cmrInfo}
    />
  );

  const footerLeftSideLinks = footerWrapper.find('[className="footer__links"] div');
  t.true(footerWrapper.exists('.footer__links')); // footer links on left exist
  t.is(footerLeftSideLinks.find('div').length, 4); // four divs
  t.is(footerLeftSideLinks.find('div').at(0).text(), 'NASA'); // NASA text 
  t.is(footerLeftSideLinks.find('a').length, 3); // three links
  t.is(footerLeftSideLinks.find('a').at(0).text(), 'FOIA'); // first link text
  t.is(footerLeftSideLinks.find('a').at(0).props().href, 'https://www.nasa.gov/FOIA/index.html'); // first link href
  t.is(footerLeftSideLinks.find('a').at(1).text(), 'Privacy'); // second link text
  t.is(footerLeftSideLinks.find('a').at(1).props().href, 'https://www.nasa.gov/about/highlights/HP_Privacy.html'); // second link href
  t.is(footerLeftSideLinks.find('a').at(2).text(), 'Feedback'); // third link text
  t.is(footerLeftSideLinks.find('a').at(2).props().href, 'https://github.com/nasa/cumulus-dashboard/issues'); // third link href
});

test('Open Cumulus GitHub Docs link shown in the footer', function (t) {
  const api = { authenticated: true };
  const apiVersion = {
    versionNumber: '1.11.0',
  };
  const cmrInfo = {
    cmrEnv: 'UAT',
    cmrProvider: 'CUMULUS',
    cmrOauthProvider: 'Launchpad'
  }
  const dashboardVersion = pckg.version;

  const footerWrapper = shallow(
    <Footer
      api={api}
      apiVersion={apiVersion}
      cmrInfo={cmrInfo}
    />
  );

  const footerLeftSideLinks = footerWrapper.find('[className="footer__opensource"] div');
  t.true(footerWrapper.exists('.footer__opensource')); // footer links on left exist
  t.is(footerLeftSideLinks.find('div').length, 1); // 1 divs 
  t.is(footerLeftSideLinks.find('a').length, 1); // 1 links
  t.is(footerLeftSideLinks.find('a').at(0).text().trim(), 'Open Cumulus GitHub Docs'); // first link text
  t.is(footerLeftSideLinks.find('a').at(0).props().href, 'https://nasa.github.io/cumulus/docs/cumulus-docs-readme'); // first link href
});
