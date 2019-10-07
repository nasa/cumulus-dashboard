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
    error = body.errorMessage || body.message;
  } else if (request.method === 'PUT') {
    error = body && body.errorMessage || body && body.message || body && body.detail;
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

export const configureRequest = (params = {}) => {
  let config = params;

  if (!config.url && !config.path) {
    throw new Error('Must include a URL or path with request');
  }

  config.headers = config.headers || {};
  config.headers['Content-Type'] = 'application/json';

  if (config.path) {
    if (typeof config.path !== 'string') {
      throw new Error('Path must be a string');
    }
    config.url = url.resolve(_config.apiRoot, config.path);
  }

  const defaultRequestConfig = {
    json: true,
    resolveWithFullResponse: true,
    simple: false
  };
  config = Object.assign({}, defaultRequestConfig, config);

  return config;
};
