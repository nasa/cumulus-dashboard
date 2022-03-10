'use strict';

import test from 'ava';
import { randomBytes } from 'crypto';
import _config from '../../app/src/js/config';
import linkToKibana from '../../app/src/js/utils/kibana';


test.before((t) => {
  _config.kibanaRoot = 'http://example.com';
  t.context.config = { ... _config };
});

test('linkToKibana() will return a generic link to Kibana Discover page', function (t) {
  const expectedLink =  `http://example.com/app/discover#/`;
  const kibanaLink = linkToKibana();
  t.is(kibanaLink, expectedLink);
});
