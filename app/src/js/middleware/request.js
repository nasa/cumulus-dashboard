/* eslint-disable import/no-cycle */
import qs from 'qs';
import { CALL_API } from '../actions/types';
import {
  configureRequest,
  addRequestAuthorization
} from '../actions/helpers';
import log from '../utils/log';
import { isValidApiRequestAction } from './validate';

// Use require to allow for mocking
const axios = require('axios');
const { loginError } = require('../actions');

const handleError = ({
  id,
  type,
  error,
  requestAction,
  statusCode
}, next) => {
  console.groupCollapsed('handleError');
  console.log(`id: ${id}`);
  console.log(`type: ${type}`);
  console.dir(error);
  console.dir(requestAction);
  console.groupEnd();

  // If the error response indicates lack or failure of request
  // authorization, then the log user out
  if ([401, 403].includes(+statusCode)) {
    return next(loginError(error.message));
  }

  const errorType = `${type}_ERROR`;
  log((id ? `${errorType}: ${id}` : errorType));
  log(error);

  return next({
    id,
    config: requestAction,
    type: errorType,
    error: error.message
  });
};

export const requestMiddleware = ({ dispatch, getState }) => (next) => (action) => {
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
      paramsSerializer (params) {
        return qs.stringify(params, { arrayFormat: 'brackets' });
      }
    };

    const requestConfig = {
      ...defaultRequestConfig,
      ...requestAction
    };

    const inflightType = `${type}_INFLIGHT`;
    log((id ? `${inflightType}: ${id}` : inflightType));
    dispatch({ id, config: requestAction, type: inflightType });

    const start = new Date();
    return axios(requestConfig)
      .then((response) => {
        const { data } = response;
        const duration = new Date() - start;
        log((id ? `${type}: ${id}` : type), `${duration}ms`);
        return next({ id, type, data, config: requestAction });
      })
      .catch((error) => {
        if (error.response) {
          const { data, status } = error.response;
          return handleError(
            {
              id,
              type,
              error: data,
              requestAction,
              statusCode: status
            },
            next
          );
        }
        handleError({ id, type, error, requestAction }, next);
      });
  }

  return next(action);
};

export default requestMiddleware;
