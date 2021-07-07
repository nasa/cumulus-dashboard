'use strict';

import test from 'ava';
import { randomBytes } from 'crypto';
import _config from '../../app/src/js/config';
import {
  kibanaAllLogsLink,
  kibanaGranuleErrorsLink,
  kibanaExecutionLink
} from '../../app/src/js/utils/kibana';


test.before((t) => {
  _config.kibanaRoot = 'http://example.com';
  t.context.config = { ... _config };
});

test('kibanaAllLogsLink() will return a generic link to Kibana Discover page', function (t) {
  const expectedLink =  `http://example.com/app/discover#/`;
  const kibanaLink = kibanaAllLogsLink();
  t.is(kibanaLink, expectedLink);
});

test('kibanaGranuleErrorsLink() will return a generic link to Kibana Discover page', function (t) {
  const expectedLink =  `http://example.com/app/discover#/`;
  const kibanaLink = kibanaGranuleErrorsLink();
  t.is(kibanaLink, expectedLink);
});

test('kibanaExecutionLink() will return a generic link to Kibana Discover page', function (t) {
  const expectedLink = `http://example.com/app/discover#/`;
  const kibanaLink = kibanaExecutionLink({cumulusInstanceMeta: 'anything'}, '4f7e7390-c0e5-46b4-8b5d-429ef53198b4');
  t.is(kibanaLink, expectedLink);
});
