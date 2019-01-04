'use strict';
import test from 'ava';
import { buildRedirectUrl } from '../../app/scripts/utils/format.js';

test('buildRedirectUrl() properly strips ?token query parameter', function (t) {
  const redirect = buildRedirectUrl({
    origin: 'http://localhost:3000',
    pathname: '/',
    hash: '#/auth?token=failed-token'
  });
  t.is(redirect, encodeURIComponent('http://localhost:3000/#/auth'));
});

test('buildRedirectUrl() does not strip arbitrary query parameter', function (t) {
  const redirect = buildRedirectUrl({
    origin: 'http://localhost:3000',
    pathname: '/',
    hash: '#/auth?foo=bar'
  });
  t.is(redirect, encodeURIComponent('http://localhost:3000/#/auth?foo=bar'));
});
