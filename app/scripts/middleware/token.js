import { hashHistory } from 'react-router';
import { get } from 'object-path';
import { decode as jwtDecode } from 'jsonwebtoken';

import { refreshAccessToken } from '../actions';
import config from '../config';

const refreshInterval = Math.ceil((config.updateInterval + 1000) / 1000);

let deferred;
const refreshTokenMiddleware = ({ dispatch, getState }) => next => action => {
  if (typeof action === 'function') {
    const token = get(getState(), 'api.tokens.token');
    if (!token) {
      return next(action);
    }
    const tokenExpiration = get(jwtDecode(token), 'exp');
    if (!tokenExpiration) {
      dispatch({ type: 'LOGIN_ERROR', error: 'Invalid token' });
      return hashHistory.push('/auth');
    }
    // tokenExpiration = date seconds since epoch
    // Math.ceil(Date.now() / 1000) = now in seconds since epoch
    if ((tokenExpiration - Math.ceil(Date.now() / 1000)) <= refreshInterval) {
      const inflight = get(getState(), 'api.tokens.inflight');
      if (!inflight) {
        deferred = createDeferred();
        return refreshAccessToken(token, dispatch)
          .then(() => {
            deferred.resolve();
            return next(action);
          })
          .catch(() => {
            dispatch({ type: 'LOGIN_ERROR', error: 'Session expired' });
            return hashHistory.push('/auth');
          });
      } else {
        return deferred.promise.then(() => {
          return next(action);
        });
      }
    }
  }
  return next(action);
};

function createDeferred () {
  const deferred = {};
  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });
  return deferred;
}

module.exports = {
  refreshTokenMiddleware
};
