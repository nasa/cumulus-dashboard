'use strict';
import test from 'ava';
import nock from 'nock';
import { get, wrapRequest } from '../../app/scripts/actions/helpers';

const dispatchStub = () => true;
const getStateStub = () => ({
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
  wrapRequest(id, req1, url, type)(dispatchStub, getStateStub);

  const urlObj = { url };
  const req2 = (config) => {
    t.deepEqual(config, { url, headers, json: true });
  };
  wrapRequest(id, req2, urlObj, type)(dispatchStub, getStateStub);

  const body = { limit: 1 };
  const req3 = (config) => {
    t.deepEqual(config, {
      url: url,
      json: true,
      body: { limit: 1 },
      headers
    });
  };
  wrapRequest(id, req3, urlObj, type, body)(dispatchStub, getStateStub);
});

test.cb('should make GET request', (t) => {
  const stubbedResponse = { message: 'success' };
  nock('http://localhost:5001')
    .get('/test-path')
    .reply(200, stubbedResponse);

  get({
    url: 'http://localhost:5001/test-path',
    json: true
  }, (_, data) => {
    t.deepEqual(data, stubbedResponse);
    t.end();
  });
});

test.todo('GET returning 4xx response');
test.todo('POST request');
test.todo('PUT request');
test.todo('DELETE request');
