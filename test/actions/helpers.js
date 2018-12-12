'use strict';
import test from 'ava';
import nock from 'nock';

import _config from '../../app/scripts/config';
import { CALL_API } from '../../app/scripts/actions';
import { get, configureRequest, wrapRequest } from '../../app/scripts/actions/helpers';

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

test.beforeEach((t) => {
  t.context.defaultConfig = {
    json: true,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  _config.apiRoot = 'http://localhost';
});

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

test('configureRequest() should throw error if no URL is provided', (t) => {
  const requestParams = {};

  t.throws(() => configureRequest(requestParams), 'Must include a url with request');
});

test('configureRequest() should add default parameters', (t) => {
  const requestParams = {
    url: 'http://localhost/test'
  };
  const expectedConfig = {
    ...t.context.defaultConfig,
    url: 'http://localhost/test'
  };
  const requestConfig = configureRequest(requestParams);
  t.deepEqual(requestConfig, expectedConfig);
});

test('configureRequest() should convert path to URL', (t) => {
  const requestParams = {
    path: 'test'
  };
  const expectedConfig = {
    ...t.context.defaultConfig,
    path: 'test',
    url: 'http://localhost/test'
  };
  const requestConfig = configureRequest(requestParams);
  t.deepEqual(requestConfig, expectedConfig);
});

test('configureRequest() should add the request body', (t) => {
  const requestBody = {
    test: 'test'
  };
  const requestParams = {
    url: 'http://localhost/test',
    body: requestBody
  };
  const expectedConfig = {
    ...t.context.defaultConfig,
    url: 'http://localhost/test',
    body: requestBody
  };
  const requestConfig = configureRequest(requestParams);
  t.deepEqual(requestConfig, expectedConfig);
});

test('configureRequest() should maintain query state parameters', (t) => {
  const queryParameters = {
    test: 'test'
  };
  const requestParams = {
    url: 'http://localhost/test',
    qs: queryParameters
  };
  const expectedConfig = {
    ...t.context.defaultConfig,
    url: 'http://localhost/test',
    qs: queryParameters
  };
  const requestConfig = configureRequest(requestParams);
  t.deepEqual(requestConfig, expectedConfig);
});

test('configureRequest() should not overwrite auth headers', (t) => {
  let requestParams = {
    path: 'test',
    headers: {
      Authorization: 'Bearer fake-token'
    }
  };

  const expectedConfig = {
    ...t.context.defaultConfig,
    path: 'test',
    url: 'http://localhost/test',
    headers: {
      ...t.context.defaultConfig.headers,
      Authorization: 'Bearer fake-token'
    }
  };

  const requestConfig = configureRequest(requestParams);

  t.deepEqual(requestConfig, expectedConfig);
});

test.cb('get() should make GET request', (t) => {
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
