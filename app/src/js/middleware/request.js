import requestPromise from 'request-promise';

import { loginError } from '../actions';
import { CALL_API } from '../actions/types';
import {
  configureRequest,
  addRequestAuthorization,
  getErrorMessage
} from '../actions/helpers';
import log from '../utils/log';
import { isValidApiRequestAction } from './validate';

const handleError = ({ id, type, error, requestAction }, next) => {
  console.groupCollapsed('handleError');
  console.log(`id: ${id}`);
  console.log(`type: ${type}`);
  console.dir(error);
  console.dir(requestAction);
  console.groupEnd();
  if (error.message) {
    // Temporary fix until the 'logs' endpoint is fixed
    // TODO: is this still relevant?
    if (error.message.includes('Invalid Authorization token') &&
        requestAction.url.includes('logs')) {
      const data = { results: [] };
      return next({ id, type, data, config: requestAction });
    }

    // Catch the session expired error
    // Weirdly error.message shows up as " : Session expired"
    // So it's using indexOf instead of a direct comparison
    if (error.message.includes('Your session has expired. Please login again.') ||
        error.message.includes('Invalid Authorization token') ||
        error.message.includes('Access token has expired')) {
      return next(loginError(error.message.replace('Bad Request: ', '')));
    }
  }

  const errorType = type + '_ERROR';
  log((id ? errorType + ': ' + id : errorType));
  log(error);

  return next({
    id,
    config: requestAction,
    type: errorType,
    error: error.message
  });
};

export const requestMiddleware = ({ dispatch, getState }) => next => action => {
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

    const inflightType = type + '_INFLIGHT';
    log((id ? inflightType + ': ' + id : inflightType));
    dispatch({ id, config: requestAction, type: inflightType });

    const start = new Date();
    return requestPromise(requestAction)
      .then((response) => {
        const { body } = response;

        if (+response.statusCode >= 400) {
          const error = new Error(getErrorMessage(response));
          return handleError({ id, type, error, requestAction }, next);
        }

        const duration = new Date() - start;
        log((id ? type + ': ' + id : type), duration + 'ms');
        return next({ id, type, data: body, config: requestAction });
      })
      .catch((error) => handleError({ id, type, error, requestAction }, next));
  }

  return next(action);
};
