'use strict';
import test from 'ava';

import _config from '../../app/scripts/config';
import {
  addRequestHeaders,
  formatError,
  getError,
  configureRequest,
  wrapRequest
} from '../../app/scripts/actions/helpers';

const dispatchStub = () => true;
const getStateStub = () => ({
  api: {
    tokens: {
      token: 'fake-token'
    }
  }
});
const type = 'TEST';
const id = 'id';

test.beforeEach((t) => {
  t.context.defaultConfig = {
    json: true,
    resolveWithFullResponse: true,
    simple: false
  };

  t.context.expectedHeaders = {
    Authorization: 'Bearer fake-token',
    'Content-Type': 'application/json'
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
    t.deepEqual(config, {
      ...t.context.defaultConfig,
      url,
      headers: t.context.expectedHeaders
    });
  };
  wrapRequest(id, req2, urlObj, type)(dispatchStub, getStateStub);

  const body = { limit: 1 };
  const req3 = (config) => {
    t.deepEqual(config, {
      ...t.context.defaultConfig,
      url: url,
      body: { limit: 1 },
      headers: t.context.expectedHeaders
    });
  };
  wrapRequest(id, req3, urlObj, type, body)(dispatchStub, getStateStub);
});

test('formatError() should handle error responses properly', (t) => {
  const requestErrorMessage = 'Request failed';
  const response = {
    statusMessage: requestErrorMessage
  };

  let formattedError = formatError();
  t.is(formattedError, '');

  formattedError = formatError(null);
  t.is(formattedError, '');

  formattedError = formatError(response);
  t.is(formattedError, requestErrorMessage);

  const bodyErrorName = 'InternalServerError';
  const bodyErrorMessage = 'Internal server error';

  formattedError = formatError(null, {
    name: bodyErrorName
  });
  t.is(formattedError, bodyErrorName);

  formattedError = formatError(null, {
    message: bodyErrorMessage
  });
  t.is(formattedError, bodyErrorMessage);

  formattedError = formatError(response, {
    name: bodyErrorName
  });
  t.is(formattedError, bodyErrorName);

  formattedError = formatError(response, {
    message: bodyErrorMessage
  });
  t.is(formattedError, `${requestErrorMessage}: ${bodyErrorMessage}`);

  formattedError = formatError(response, {
    name: bodyErrorName,
    message: bodyErrorMessage
  });
  t.is(formattedError, `${bodyErrorName}: ${bodyErrorMessage}`);
});

test('addRequestHeaders() should return correct headers', (t) => {
  const headers = addRequestHeaders(getStateStub());
  t.deepEqual(headers, t.context.expectedHeaders);
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

test('getError() returns correct errors', (t) => {
  let error = getError({
    request: { method: 'PUT' },
    body: { detail: 'Detail error' }
  });
  t.is(error, 'Detail error');

  error = getError({
    request: { method: 'PUT' },
    body: { errorMessage: 'PUT error' }
  });
  t.is(error, 'PUT error');

  error = getError({
    request: { method: 'DELETE' },
    body: { errorMessage: 'DELETE error' }
  });
  t.is(error, 'DELETE error');

  error = getError({
    request: { method: 'POST' },
    body: { errorMessage: 'POST error' }
  });
  t.is(error, 'POST error');

  error = getError({
    request: { method: 'GET' },
    body: { message: 'Test error' }
  });
  t.deepEqual(error, new Error('Test error'));
});
