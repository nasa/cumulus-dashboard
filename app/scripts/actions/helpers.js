'use strict';
import url from 'url';
import { get as getProperty } from 'object-path';
import _config from '../config';

export const formatError = (response = {}, body) => {
  let error = response
    ? response.statusMessage || ''
    : '';
  body = body || {};
  if (body.name) error = body.name;
  if (body.message) error += `${(error ? ': ' : '')}${body.message}`;
  return error;
};

export const getError = (response) => {
  const { request, body } = response;
  let error;

  // TODO: is this still relevant?
  if (request.method === 'DELETE' || request.method === 'POST') {
    error = body.errorMessage;
  } else if (request.method === 'PUT') {
    error = body && body.errorMessage || body && body.detail;
  }

  if (error) return error;

  error = new Error(formatError(response, body));
  return error;
};

export const addRequestAuthorization = (config, state) => {
  let token = getProperty(state, 'api.tokens.token');
  if (token) {
    config.headers = Object.assign({}, config.headers, {
      Authorization: `Bearer ${token}`
    });
  }
};

export const configureRequest = function (params, body) {
  // TODO: enforce that params is an object and set config = params
  let config = {};
  if (typeof params === 'object') {
    config = params;
  }

  config.headers = config.headers || {};
  config.headers['Content-Type'] = 'application/json';

  if (typeof params === 'string') {
    config.url = url.resolve(_config.apiRoot, params);
  } else if (params.url) {
    config = params;
  } else if (params.path && typeof params.path === 'string') {
    config.url = url.resolve(_config.apiRoot, params.path);
  } else {
    throw new Error('Must include a url with request');
  }

  if (body && typeof body === 'object') {
    config.body = body;
  } else if (params.body && typeof params.body === 'object') {
    config.body = params.body;
  }

  const defaultRequestConfig = {
    json: true,
    resolveWithFullResponse: true,
    simple: false
  };
  config = Object.assign({}, defaultRequestConfig, config);

  return config;
};
