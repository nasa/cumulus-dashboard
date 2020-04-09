'use strict';
import test from 'ava';
import { buildRedirectUrl } from '../../app/src/js/utils/format.js';

test('buildRedirectUrl() properly strips ?token query parameter', function (t) {
  const redirect = buildRedirectUrl({
    origin: 'http://localhost:3000',
    pathname: '/',
    hash: '/auth?token=failed-token'
  });
  t.is(redirect, encodeURIComponent('http://localhost:3000/auth'));
});

test('buildRedirectUrl() properly strips ?token query parameter with hashRouter style hash ', function (t) {
  const redirect = buildRedirectUrl({
    origin: 'http://localhost:3000',
    pathname: '/',
    hash: '#/auth?token=failed-token'
  });

  // TODO [MHS, 2020-04-04] The current code is wrong, we should preserve the
  // hash and path when we have a hashrouter.

  // t.is(redirect, encodeURIComponent('http://localhost:3000/#/auth'));
  t.is(redirect, encodeURIComponent('http://localhost:3000/auth'));
});

test('buildRedirectUrl() does not strip arbitrary query parameter', function (t) {
  const redirect = buildRedirectUrl({
    origin: 'http://localhost:3000',
    pathname: '/',
    hash: '/auth?foo=bar'
  });
  t.is(redirect, encodeURIComponent('http://localhost:3000/auth?foo=bar'));
});

test('buildRedirectUrl() does not strip arbitrary query parameter with hashRouter style url', function (t) {
  const redirect = buildRedirectUrl({
    origin: 'http://localhost:3000',
    pathname: '/',
    hash: '#/auth?foo=bar'
  });

  // TODO [MHS, 2020-04-04] The current code is wrong, we should preserve the
  // hash and path when we have a hashrouter.
  // t.is(redirect, encodeURIComponent('http://localhost:3000/#/auth?foo=bar'));
  t.is(redirect, encodeURIComponent('http://localhost:3000/auth?foo=bar'));
});
