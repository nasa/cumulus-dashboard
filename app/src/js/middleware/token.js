/* eslint-disable import/no-cycle */
import { get } from 'object-path';
import { decode as jwtDecode } from 'jsonwebtoken';

import { loginError, refreshAccessToken } from '../actions';
import config from '../config';
import { isValidApiRequestAction } from './validate';

let deferred;
export const refreshTokenMiddleware = ({ dispatch, getState }) => (next) => (action) => {
  if (isValidApiRequestAction(action)) {
    const token = get(getState(), 'api.tokens.token');
    if (!token) {
      console.log('[refreshTokenMiddleware] No token found, skipping refresh');
      return next(action);
    }

    const jwtData = jwtDecode(token);
    if (!jwtData) {
      console.log('[refreshTokenMiddleware] Invalid JWT data, skipping refresh');
      return next(action);
    }

    const tokenExpiration = get(jwtData, 'exp');
    if (!tokenExpiration) {
      console.error('[refreshTokenMiddleware] No expiration found in token');
      return dispatch(loginError('Invalid token'));
    }

    const currentTime = Math.ceil(Date.now() / 1000);
    const timeLeft = tokenExpiration - currentTime;
    console.log('[refreshTokenMiddleware] Token check - timeLeft:', timeLeft, 'seconds, refreshThreshold:', config.tokenRefreshThreshold);

    if (timeLeft <= config.tokenRefreshThreshold) {
      console.log('[refreshTokenMiddleware] Token expiring soon, attempting refresh');
      const inflight = get(getState(), 'api.tokens.inflight');
      if (!inflight) {
        deferred = createDeferred();
        return dispatch(refreshAccessToken(token))
          .then(() => {
            console.log('[refreshTokenMiddleware] Token refresh successful, proceeding with action');
            deferred.resolve();
            return next(action);
          })
          .catch((error) => {
            console.error('[refreshTokenMiddleware] Token refresh failed:', error);
            return dispatch(loginError('Session expired'));
          });
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
