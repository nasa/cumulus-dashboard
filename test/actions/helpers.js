'use strict';
import test from 'ava';
import { wrapRequest } from '../../app/scripts/actions/helpers';

const dispatch = () => true;
const getState = () => ({
  api: {
    tokens: {
      token: 'token'
    }
  }
});
const type = 'TEST';
const id = 'id';
const headers = {
  Authorization: 'Bearer token',
  'Content-Type': 'application/json'
};
test('wrap request', function (t) {
  t.plan(3);

  const url = 'blahblahblah';
  const req1 = (config) => {
    t.true(/blahblahblah/.test(config.url));
  };
  wrapRequest(id, req1, url, type)(dispatch, getState);

  const urlObj = { url };
  const req2 = (config) => {
    t.deepEqual(config, { url, headers, json: true });
  };
  wrapRequest(id, req2, urlObj, type)(dispatch, getState);

  const body = { limit: 1 };
  const req3 = (config) => {
    t.deepEqual(config, {
      url: url,
      json: true,
      body: { limit: 1 },
      headers
    });
  };
  wrapRequest(id, req3, urlObj, type, body)(dispatch, getState);
});
