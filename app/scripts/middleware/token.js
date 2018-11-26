import { hashHistory } from 'react-router';
import { get } from 'object-path';
import { decode as jwtDecode } from 'jsonwebtoken';

import { refreshAccessToken } from '../actions';

let deferred;
const refreshTokenMiddleware = ({ dispatch, getState }) => next => action => {
  if (typeof action === 'function') {
    const token = get(getState(), 'api.tokens.token');
    const tokenExpiration = get(jwtDecode(token), 'exp');
    if (!tokenExpiration) {
      dispatch({ type: 'LOGIN_ERROR', error: 'Invalid token' });
      return hashHistory.push('/auth');
    }
    if (token && (tokenExpiration - Math.floor(Date.now() / 1000)) <= 3) {
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
