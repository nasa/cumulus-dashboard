/* eslint-disable import/no-cycle */
import qs from 'qs';
import _config from '../config';
import { CALL_API } from '../actions/types';
import { configureRequest, addRequestAuthorization } from '../actions/helpers';
import log from '../utils/log';
import { isValidApiRequestAction } from './validate';

// Use require to allow for mocking
const axios = require('axios');
const { loginError } = require('../actions');

const apiRootHost = new URL(_config.apiRoot).host;

const handleError = ({ id, type, error, requestAction, statusCode }, next) => {
  console.groupCollapsed('handleError');
  console.log(`id: ${id}`);
  console.log(`type: ${type}`);
  console.log('error:');
  console.dir(error);
  console.log('requestAction:');
  console.dir(requestAction);
  console.groupEnd();

  // If the error response indicates lack or failure of request
  // authorization, then the log user out
  if (
    [401, 403].includes(+statusCode) &&
    new URL(requestAction.url).host === apiRootHost
  ) {
    return next(loginError(error.message));
  }

  const errorType = `${type}_ERROR`;
  log(id ? `${errorType}: ${id}` : errorType);

  // pull message from data if there is a data field, or just use message off of the error.message
  let nextError;
  try {
    nextError = error.response.data.message
      ? error.response.data.message
      : error.message;
  } catch (e) {
    if (e instanceof TypeError) {
      nextError = error.message;
    }
  }

  return next({
    id,
    config: requestAction,
    type: errorType,
    error: nextError,
  });
};

export const requestMiddleware =
  ({ dispatch, getState }) => (next) => (action) => {
    if (isValidApiRequestAction(action)) {
      let requestAction = action[CALL_API];

      if (!requestAction.method) {
        throw new Error('Request action must include a method');
      }

      requestAction = configureRequest(requestAction);
      if (!requestAction.skipAuth) {
        addRequestAuthorization(requestAction, getState());
      }

      const { id, type } = requestAction;

      const defaultRequestConfig = {
        paramsSerializer(params) {
          return qs.stringify(params, { arrayFormat: 'brackets' });
        },
      };

      const requestConfig = {
        ...defaultRequestConfig,
        ...requestAction,
      };

      const inflightType = `${type}_INFLIGHT`;
      log(id ? `${inflightType}: ${id}` : inflightType);
      dispatch({ id, config: requestAction, type: inflightType });

      const start = new Date();

      console.log('----------requestConfig', requestConfig);

      const fetchData = () => {
        fetchWithTimeout(requestConfig, 7000)
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then((data) => {
            console.log(data);
          })
          .catch((error) => {
            console.error('Failed to fetch:', error);
          });
      };

      const fetchWithTimeout = (url, timeout = 5000) => {
        const timeoutPromise = new Promise((resolve, reject) => {
          const timer = setTimeout(() => {
            clearTimeout(timer);
            reject(new Error('Request timed out')); // Rejects the promise
          }, timeout);
        });

        // This races the timeout against the fetch request
        return Promise.race([
          axiosFetch(),
          timeoutPromise
        ]);
      };

      console.log('----------fetchWithTimeout', fetchWithTimeout);

      const axiosFetch = () => {
        axios(requestConfig).then((response) => {
          const { data } = response;
          const duration = new Date() - start;
          log(id ? `${type}: ${id}` : type, `${duration}ms`);
          return next({ id, type, data, config: requestAction });
        })
          .catch((error) => {
            if (error.response) {
              const { status } = error.response;
              return handleError(
                {
                  id,
                  type,
                  error,
                  requestAction,
                  statusCode: status,
                },
                next
              );
            }
            return handleError({ id, type, error, requestAction }, next);
          });
      };

      return fetchData();
    }
    return next(action);
  };

export default requestMiddleware;
