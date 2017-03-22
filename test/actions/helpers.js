'use strict';
import test from 'tape';
import { wrapRequest } from '../../app/scripts/actions/helpers';

const dispatch = () => true;
const type = 'TEST';
const id = 'id';
const headers = {
  'Content-Type': 'application/json'
}
test('wrap request', function (t) {
  t.plan(3);

  const url = 'blahblahblah';
  const req1 = (config) => {
    t.ok(/blahblahblah/.test(config.url));
  };
  wrapRequest(id, req1, url, type)(dispatch);

  const urlObj = { url };
  const req2 = (config) => {
    t.deepEquals(config, { url, headers, json: true });
  };
  wrapRequest(id, req2, urlObj, type)(dispatch);

  const body = { limit: 1 };
  const req3 = (config) => {
    t.deepEquals(config, {
      url: url,
      json: true,
      body: { limit: 1 },
      headers
    });
  };
  wrapRequest(id, req3, urlObj, type, body)(dispatch);
});
