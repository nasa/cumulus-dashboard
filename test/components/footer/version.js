'use strict';

import test from 'ava';
import {render} from '@testing-library/react'
import React from 'react';

import Footer from '../../../app/src/js/components/Footer/footer.js';

const pckg = require('../../../package.json');

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

 const { container } = render(<Footer
     api={api}
     apiVersion={apiVersion}
     cmrInfo={cmrInfo}
   />
 )

 const versionInfo = container.querySelector('.version__info');
 t.falsy(versionInfo);
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

  const { container } = render(
    <Footer
      api={api}
      apiVersion={apiVersion}
      cmrInfo={cmrInfo}
    />
  );

  const apiVersionNumber = container.querySelector('.api__version').textContent;

  t.is(`API v${apiVersion.versionNumber}`, apiVersionNumber);
  const hasApiWarning = container.querySelector('.api__warning');
  t.falsy(hasApiWarning);
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

  const { container } = render(
    <Footer
      api={api}
      apiVersion={apiVersion}
      cmrInfo={cmrInfo}
    />
  );

  const apiWarning = container.querySelector('.api__warning');
  const hasApiWarning = apiWarning.classList.contains('api__warning');
  t.true(hasApiWarning);
  t.is(`Warning: ${apiVersion.warning}`, apiWarning.textContent);
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

  const { container } = render(
    <Footer
      api={api}
      apiVersion={apiVersion}
      cmrInfo={cmrInfo}
    />
  );

  const dashboardVersionNumber = container.querySelector('.dashboard__version');
  t.is(`Dashboard v${dashboardVersion}`, dashboardVersionNumber.textContent);
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

 const { container } = render(
   <Footer
     api={api}
     apiVersion={apiVersion}
     cmrInfo={cmrInfo}
   />
 );

 // const footerLeftSideLinks = footerWrapper.find('[className="footer__links"] div');
 const footerLeftSideLinks = container.querySelector('.footer__links');

 t.truthy(footerLeftSideLinks); // footer links on left exist

 t.is(footerLeftSideLinks.querySelectorAll('div').length, 5); // five divs
 t.is(footerLeftSideLinks.querySelectorAll('div')[0].textContent, 'NASA'); // NASA text
 t.is(footerLeftSideLinks.querySelectorAll('a').length, 4); // four links
 t.is(footerLeftSideLinks.querySelectorAll('a')[0].textContent, 'FOIA'); // first link text
 t.is(footerLeftSideLinks.querySelectorAll('a')[0].getAttribute('href'), 'https://www.nasa.gov/FOIA/index.html'); // first link href
 t.is(footerLeftSideLinks.querySelectorAll('a')[1].textContent, 'Privacy'); // second link text
 t.is(footerLeftSideLinks.querySelectorAll('a')[1].getAttribute('href'), 'https://www.nasa.gov/about/highlights/HP_Privacy.html'); // second link href
 t.is(footerLeftSideLinks.querySelectorAll('a')[2].textContent, 'Feedback'); // third link text
 t.is(footerLeftSideLinks.querySelectorAll('a')[2].getAttribute('href'), 'https://github.com/nasa/cumulus-dashboard/issues'); // third link href
 t.is(footerLeftSideLinks.querySelectorAll('a')[3].textContent, 'Accessibility'); // fourth link text
 t.is(footerLeftSideLinks.querySelectorAll('a')[3].getAttribute('href'), 'https://www.nasa.gov/accessibility/'); // fourth link href
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

  const { container } = render(
    <Footer
      api={api}
      apiVersion={apiVersion}
      cmrInfo={cmrInfo}
    />
  );

  //const footerLeftSideLinks = footerWrapper.find('[className="footer__opensource"] div');
  const footerLeftSideLinks = container.querySelector('.footer__opensource');

  t.truthy(container.querySelectorAll('.footer__opensource')); // footer links on left exist
  t.is(footerLeftSideLinks.querySelectorAll('div').length, 1); // 1 divs
  t.is(footerLeftSideLinks.querySelectorAll('a').length, 1); // 1 links
  t.is(footerLeftSideLinks.querySelectorAll('a')[0].textContent.trim(), 'Open Cumulus GitHub Docs'); // first link text
  t.is(footerLeftSideLinks.querySelectorAll('a')[0].getAttribute('href'), 'https://nasa.github.io/cumulus/docs/cumulus-docs-readme'); // first link href
});
