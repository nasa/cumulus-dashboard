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
      console.log('[refreshTokenMiddleware] Not a JWT, skipping');
      return next(action);
    }

    const tokenExpiration = get(jwtData, 'exp');
    if (!tokenExpiration) {
      console.error('[refreshTokenMiddleware] No expiration in token, logging out');
      return dispatch(loginError('Invalid token'));
    }

    const currentTime = Math.ceil(Date.now() / 1000);
    const timeLeft = tokenExpiration - currentTime;

    console.log('[refreshTokenMiddleware] Token check:', {
      tokenExpiration,
      currentTime,
      timeLeft,
      refreshInterval,
      needsRefresh: timeLeft <= refreshInterval
    });

    // tokenExpiration = date seconds since epoch
    // Math.ceil(Date.now() / 1000) = now in seconds since epoch
    if (timeLeft <= refreshInterval) {
      console.log('[refreshTokenMiddleware] Token needs refresh');
      const inflight = get(getState(), 'api.tokens.inflight');
      if (!inflight) {
        console.log('[refreshTokenMiddleware] Starting refresh');
        deferred = createDeferred();
        return dispatch(refreshAccessToken(token))
          .then(() => {
            console.log('[refreshTokenMiddleware] Refresh completed successfully');
            deferred.resolve();
            return next(action);
          })
          .catch((error) => {
            console.error('[refreshTokenMiddleware] Refresh failed, logging out:', error);
            return dispatch(loginError('Session expired'));
          });
      }

      console.log('[refreshTokenMiddleware] Refresh already in flight, waiting');
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
