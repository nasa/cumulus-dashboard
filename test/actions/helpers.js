'use strict';
import test from 'ava';
import { wrapRequest } from '../../app/scripts/actions/helpers';

const dispatchStub = () => true;
const type = 'TEST';
const id = 'id';
const headers = {
  'Content-Type': 'application/json'
};
test('wrap request', function (t) {
  t.plan(3);

  const url = 'blahblahblah';
  const req1 = (config) => {
    t.true(/blahblahblah/.test(config.url));
  };
  wrapRequest(id, req1, url, type)(dispatchStub);

  const urlObj = { url };
  const req2 = (config) => {
    t.deepEqual(config, { url, headers, json: true });
  };
  wrapRequest(id, req2, urlObj, type)(dispatchStub);

  const body = { limit: 1 };
  const req3 = (config) => {
    t.deepEqual(config, {
      url: url,
      json: true,
      body: { limit: 1 },
      headers
    });
  };
  wrapRequest(id, req3, urlObj, type, body)(dispatchStub);
});

test('wrapRequest invokes callback on success.', (t) => {
  t.plan(1);
  const params = { url: 'fakeURL' };
  const type = 'ANY';

  const callback = (dispatch, data) => t.true(true);
  const successfulQuery = (config, cb) => cb(null, []);

  wrapRequest(null, successfulQuery, params, type, null, callback)(dispatchStub);
});
