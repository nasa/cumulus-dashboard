'use strict';
import url from 'url';
import request from 'request';
import _config from '../config';
const root = _config.apiRoot;

import { setError } from './';

export const get = function (config, callback) {
  request(config, (error, resp, body) => {
    if (error) {
      return callback(error);
    }
    try {
      var data = JSON.parse(body);
    } catch (e) {
      return callback('JSON parse error');
    }
    return callback(null, data);
  });
};

export const post = function (config, callback) {
  request.post(config, (error, resp, body) => {
    error = error || body.errorMessage;
    if (error) {
      return callback(error);
    } else {
      return callback(null, body);
    }
  });
};

export const put = function (config, callback) {
  request.put(config, (error, resp, body) => {
    error = error || body.errorMessage;
    if (error) {
      return callback(error);
    } else {
      return callback(null, body);
    }
  });
};

export const wrapRequest = function (requestFunction, requestConfig, payload, type, dispatchFn) {
  if (!dispatchFn) {
    dispatchFn = type;
    type = payload;
    payload = null;
  }
  let config;
  if (typeof requestConfig === 'string') {
    config = {
      url: url.resolve(root, requestConfig)
    };
  } else if (requestConfig.url) {
    config = requestConfig;
  } else {
    throw new Error('Must include a url with request');
  }

  if (payload) {
    config.body = payload;
    config.json = true;
  }

  return function (dispatch) {
    requestFunction(config, (error, data) => {
      if (error) {
        return dispatch(setError({
          error,
          meta: Object.assign({ type }, config)
        }));
      } else {
        return dispatch(dispatchFn(data));
      }
    });
  };
};
