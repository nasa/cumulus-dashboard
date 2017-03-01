'use strict';
import url from 'url';
import request from 'request';
import _config from '../config';
import log from '../utils/log';
const root = _config.apiRoot;

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

  if (body && typeof body === 'object') {
    config.body = body;
    config.json = true;
  }

  return function (dispatch) {
    const inflightType = type + '_INFLIGHT';
    log((id ? inflightType + ': ' + id : inflightType));

    dispatch({ id, type: inflightType });

    query(config, (error, data) => {
      if (error) {
        const errorType = type + '_ERROR';
        log((id ? errorType + ': ' + id : errorType));
        log(error);

        return dispatch({
          id,
          type: errorType,
          error
        });

      } else {
        log((id ? type + ': ' + id : type));

        return dispatch({ id, type, data });
      }
    });
  };
};
