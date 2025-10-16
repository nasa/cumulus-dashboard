'use strict';
import test from 'ava';
import {
  buildRedirectUrl,
  getFormattedCollectionId,
  formatCollectionId,
  fullDate,
  collectionHrefFromId,
  collectionHrefFromNameVersion,
  getEncodedCollectionId,
  deconstructCollectionId
} from '../../app/src/js/utils/format.js';
import config from '../../app/src/js/config.js';

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

test('deconstructCollectionId decodes collectionId', (t) => {
  const collectionId = 'somecollectionname_____collectionversion';
  const expected = {
    name: 'somecollectionname__',
    version: 'collectionversion'
  };
  const actual = deconstructCollectionId(collectionId);
  t.deepEqual(expected, actual);
});

test('deconstructCollectionId throws error on bad collection collectionId', (t) => {
  const collectionId = 'isthisbad?';
  t.throws(
    ()=> deconstructCollectionId(collectionId),
    {message: 'invalid collectionId: "isthisbad?"' }
  );
});

test('getFormattedCollectionId returns a formatted collection', function (t) {
  t.is('foo___006', getFormattedCollectionId({ name: 'foo', version: '006' }));
});

test('getFormattedCollectionId returns a formatted collection when name has trailing underscores', function (t) {
  t.is('foo______006', getFormattedCollectionId({ name: 'foo___', version: '006' }));
});

test('getFormattedCollectionId returns a nullValue collection if the collection is empty', function (t) {
  t.is('--', getFormattedCollectionId({}));
});

test('getFormattedCollectionId returns a nullValue collection if the collection is undefined', function (t) {
  t.is('--', getFormattedCollectionId());
});

test('formatCollectionId returns a formatted collection', function (t) {
  t.is('foo___006', formatCollectionId('foo___006'));
});

test('formatCollectionId returns a nullValue collection if the collection is undefined', function (t) {
  t.is('--', formatCollectionId());
});

test('getEncodedCollectionId returns an encoded collection', function (t) {
  t.is('foo___bar%2F006', getEncodedCollectionId({ name: 'foo', version: 'bar/006' }));
});

test('getEncodedCollectionId returns an encoded collection with trailing underscores in shortname', function (t) {
  t.is('foo_______bar%2F006', getEncodedCollectionId({ name: 'foo____', version: 'bar/006' }));
});

test('getEncodedCollectionId returns a formatted collection when no encoding is needed', function (t) {
  t.is('foo___006', getEncodedCollectionId({ name: 'foo', version: '006' }));
});

test('getEncodedCollectionId returns a nullValue collection if the collection is empty', function (t) {
  t.is('--', getEncodedCollectionId({}));
});

test('getEncodedCollectionId returns a nullValue collection if the collection is undefined', function (t) {
  t.is('--', getEncodedCollectionId());
});

test('collectionHrefFromId returns an encoded collection href', function (t) {
  t.is('/collections/collection/foo/bar%2F006', collectionHrefFromId('foo___bar/006'));
});

test('collectionHrefFromId returns a formatted collection href when no encoding is needed', function (t) {
  t.is('/collections/collection/foo/006', collectionHrefFromId('foo___006'));
});

test('collectionHrefFromId returns a formatted collection href when trailing underscores in collection shortname', function (t) {
  t.is('/collections/collection/foo__/006', collectionHrefFromId('foo_____006'));
});

test('collectionHrefFromId returns a nullValue collection if the collectionId is undefined', function (t) {
  t.is('--', collectionHrefFromId());
});

test('collectionHrefFromNameVersion returns an encoded collection href', function (t) {
  t.is('/collections/collection/foo/bar%2F006', collectionHrefFromNameVersion({ name: 'foo', version: 'bar/006' }));
});

test('collectionHrefFromNameVersion returns a formatted collection when no encoding is needed', function (t) {
  t.is('/collections/collection/foo/006', collectionHrefFromNameVersion({ name: 'foo', version: '006' }));
});

test('collectionHrefFromNameVersion returns a nullValue collection if the collection is empty', function (t) {
  t.is('--', collectionHrefFromNameVersion({}));
});

test('collectionHrefFromNameVersion returns a nullValue collection if the collection is undefined', function (t) {
  t.is('--', collectionHrefFromNameVersion());
});

test('fullDate and dateOnly returns the properly formatted date', function (t) {
  const fullDate = '1744833161789';
  const fullDate2 = '1759434229834';
  const dateOnly = '1744783161789';
  const dateOnly2 = '1744683161789';

  config.initialTimezoneFormat = 'UTC';
  const formattedUTCDate = fullDate(fullDate);
  const formattedUTCDate2 = fullDate(fullDate2);
  t.is(formattedUTCDate, '19:52:41 04/14/25');
  t.is(formattedUTCDate2, '19:43:49 10/02/25');

  const formattedUTCDateOnly = dateOnly(dateOnly);
  const formattedUTCDateOnly2 = dateOnly(dateOnly2);
  t.is(formattedUTCDateOnly, '04/16/25');
  t.is(formattedUTCDateOnly2, '04/15/25');

  config.initialTimezoneFormat = '';
  const formattedDate = fullDate(fullDate);
  const formattedDate2 = fullDate(fullDate2);
  t.is(formattedDate, '12:52:41 04/16/25');
  t.is(formattedDate2, '12:43:49 10/02/25');

  const formattedDateOnly = dateOnly(dateOnly);
  const formattedDateOnly2 = dateOnly(dateOnly2);
  t.is(formattedDateOnly, '04/15/25');
  t.is(formattedDateOnly2, '04/14/25');
});
