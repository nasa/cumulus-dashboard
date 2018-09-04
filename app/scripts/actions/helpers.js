'use strict';
import url from 'url';
import request from 'request';
import { hashHistory } from 'react-router';
import _config from '../config';
import log from '../utils/log';
import { get as getToken } from '../utils/auth';
const root = _config.apiRoot;

function setToken (config) {
  let token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = 'Bearer ' + token;
  }
  return config;
}

function formatError (response, body) {
  let error = response.statusMessage;
  body = body || {};
  if (body.name) error = body.name;
  if (body.message) error += `: ${body.message}`;
  return error;
}

export const get = function (config, callback) {
  request.get(setToken(config), (error, resp, body) => {
    if (error) {
      return callback(error);
    } else if (+resp.statusCode >= 400) {
      return callback(new Error(formatError(resp, body)));
    }
    return callback(null, body);
  });
};

export const post = function (config, callback) {
  request.post(setToken(config), (error, resp, body) => {
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
  request.put(setToken(config), (error, resp, body) => {
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
  request.del(setToken(config), (error, resp, body) => {
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

export const wrapRequest = function (id, query, params, type, body) {
  let config;
  if (typeof params === 'string') {
    config = {
      url: url.resolve(root, params)
    };
  } else if (params.url) {
    config = params;
  } else {
    throw new Error('Must include a url with request');
  }
  config.json = true;

  if (body && typeof body === 'object') {
    config.body = body;
  }

  config.headers = config.headers || {};
  config.headers['Content-Type'] = 'application/json';

  return function (dispatch) {
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
        if (error.message.includes('Session expired') || error.message.includes('Invalid Authorization token')) {
          dispatch({ type: 'LOGIN_ERROR', error: error.message.replace('Bad Request: ', '') });
          return hashHistory.push('/auth');
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
