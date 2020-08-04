/* eslint-disable import/no-cycle */
import { get } from 'object-path';
import { decode as jwtDecode } from 'jsonwebtoken';

import { loginError, refreshAccessToken } from '../actions';
import config from '../config';
import { isValidApiRequestAction } from './validate';

const refreshInterval = Math.ceil((config.updateInterval + 1000) / 1000);

let deferred;
export const refreshTokenMiddleware = ({ dispatch, getState }) => (next) => (action) => {
  if (isValidApiRequestAction(action)) {
    const token = get(getState(), 'api.tokens.token');
    if (!token) {
      return next(action);
    }

    const jwtData = jwtDecode(token);
    // Bail out early if this is not a JWT value to preserve backwards
    // compatibility with API returning regular tokens
    if (!jwtData) {
      return next(action);
    }

    const tokenExpiration = get(jwtData, 'exp');
    if (!tokenExpiration) {
      return dispatch(loginError('Invalid token'));
    }

    // tokenExpiration = date seconds since epoch
    // Math.ceil(Date.now() / 1000) = now in seconds since epoch
    if ((tokenExpiration - Math.ceil(Date.now() / 1000)) <= refreshInterval) {
      const inflight = get(getState(), 'api.tokens.inflight');
      if (!inflight) {
        deferred = createDeferred();
        return dispatch(refreshAccessToken(token))
          .then(() => {
            deferred.resolve();
            return next(action);
          })
          .catch(() => dispatch(loginError('Session expired')));
      }

      return deferred.promise.then(() => next(action));
    }
  }
  return next(action);
};

function createDeferred () {
  const deferredObj = {};
  deferredObj.promise = new Promise((resolve, reject) => {
    deferredObj.resolve = resolve;
    deferredObj.reject = reject;
  });
  return deferredObj;
}

export default refreshTokenMiddleware;
