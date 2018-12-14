'use strict';
import url from 'url';
import request from 'request';
import { hashHistory } from 'react-router';
import { get as getProperty } from 'object-path';
import _config from '../config';
import log from '../utils/log';
import { forceLogout } from './index';

export const formatError = (response = {}, body) => {
  let error = response
    ? response.statusMessage || ''
    : '';
  body = body || {};
  if (body.name) error = body.name;
  if (body.message) error += `${(error ? ': ' : '')}${body.message}`;
  return error;
};

export const get = function (config, callback) {
  request.get(config, (error, resp, body) => {
    if (error) {
      return callback(error);
    } else if (+resp.statusCode >= 400) {
      return callback(new Error(formatError(resp, body)));
    }
    return callback(null, body);
  });
};

export const post = function (config, callback) {
  request.post(config, (error, resp, body) => {
    error = error || body.errorMessage;
    if (error) {
      return callback(error);
    } else if (+resp.statusCode >= 400) {
      return callback(new Error(formatError(resp, body)));
    } else {
      return callback(null, body);
    }
  });
};

export const put = function (config, callback) {
  request.put(config, (error, resp, body) => {
    error = error || body && body.errorMessage || body && body.detail || null;
    if (error) {
      return callback(error);
    } else if (+resp.statusCode >= 400) {
      return callback(new Error(formatError(resp, body)));
    } else {
      return callback(null, body);
    }
  });
};

export const del = function (config, callback) {
  request.del(config, (error, resp, body) => {
    error = error || body.errorMessage;
    if (error) {
      return callback(error);
    } else if (+resp.statusCode >= 400) {
      return callback(new Error(formatError(resp, body)));
    } else {
      return callback(null, body);
    }
  });
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

export const addRequestHeaders = (state) => {
  let token = getProperty(state, 'api.tokens.token');
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

export const configureRequest = function (params, body) {
  // TODO: enforce that params is an object and set config = params
  let config = {};
  if (typeof params === 'object') {
    config = params;
  }

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

export const wrapRequest = function (id, query, params, type, body) {
  return function (dispatch, getState) {
    const config = configureRequest(params, body);
    config.headers = addRequestHeaders(getState());

    const inflightType = type + '_INFLIGHT';
    log((id ? inflightType + ': ' + id : inflightType));
    dispatch({ id, config, type: inflightType });

    const start = new Date();
    query(config, (error, data) => {
      if (error) {
        // Temporary fix until the 'logs' endpoint is fixed
        if (error.message.includes('Invalid Authorization token') && config.url.includes('logs')) {
          const data = { results: [] };
          return dispatch({ id, type, data, config });
        }

        // Catch the session expired error
        // Weirdly error.message shows up as " : Session expired"
        // So it's using indexOf instead of a direct comparison
        if (error.message.includes('Session expired') ||
            error.message.includes('Invalid Authorization token') ||
            error.message.includes('Access token has expired')) {
          return forceLogout(
            dispatch,
            getProperty(getState(), 'api.tokens.token'),
            error.message.replace('Bad Request: ', '')
          ).then(() => {
            return hashHistory.push('/auth');
          });
        }

        const errorType = type + '_ERROR';
        log((id ? errorType + ': ' + id : errorType));
        log(error);

        return dispatch({
          id,
          config,
          type: errorType,
          error
        });
      } else {
        const duration = new Date() - start;
        log((id ? type + ': ' + id : type), duration + 'ms');
        return dispatch({ id, type, data, config });
      }
    });
  };
};
