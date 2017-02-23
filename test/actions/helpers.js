'use strict';
import test from 'tape';
import { wrapRequest } from '../../app/scripts/actions/helpers';

test('wrap request', function (t) {
  t.plan(3);

  const url = 'blahblahblah';
  const req1 = (config) => {
    t.ok(/blahblahblah/.test(config.url));
  };
  wrapRequest(req1, url)();

  const urlObj = { url };
  const req2 = (config) => {
    t.deepEquals(config, { url });
  };
  wrapRequest(req2, urlObj)();

  const payload = 1;
  const req3 = (config) => {
    t.deepEquals(config, {
      url: url,
      json: true,
      body: 1
    });
  };
  wrapRequest(req3, urlObj, payload, true, true)();
});
