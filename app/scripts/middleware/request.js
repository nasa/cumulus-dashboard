import requestPromise from 'request-promise';
import { hashHistory } from 'react-router';

import { CALL_API } from '../actions';
import {
  configureRequest,
  formatError
} from '../actions/helpers';
import log from '../utils/log';

const handleError = ({ id, type, error, requestAction }, next) => {
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
    if (error.message.includes('Session expired') ||
        error.message.includes('Invalid Authorization token') ||
        error.message.includes('Access token has expired')) {
      next({ type: 'LOGIN_ERROR', error: error.message.replace('Bad Request: ', '') });
      // TODO: this is a side effect. move out of middleware
      return hashHistory.push('/auth');
    }
  }

  const errorType = type + '_ERROR';
  log((id ? errorType + ': ' + id : errorType));
  log(error);

  return next({
    id,
    config: requestAction,
    type: errorType,
    error
  });
};

const getError = (response) => {
  const { request, body } = response;
  let error;

  // TODO: is this still relevant?
  if (request.method === 'DELETE' || request.method === 'POST') {
    error = body.errorMessage;
  } else if (request.method === 'PUT') {
    error = body && body.errorMessage || body && body.detail;
  }

  if (error) return error;

  error = new Error(formatError(response, body));
  return error;
};

const doRequestMiddleware = ({ dispatch }) => next => action => {
  let requestAction = action[CALL_API];
  if (!requestAction) {
    return next(action);
  }

  if (!requestAction.method) {
    throw new Error('Request action must include a method');
  }

  requestAction = Object.assign({}, requestAction, configureRequest(requestAction));

  const { id, type } = requestAction;

  const inflightType = type + '_INFLIGHT';
  log((id ? inflightType + ': ' + id : inflightType));
  dispatch({ id, config: requestAction, type: inflightType });

  const start = new Date();
  return requestPromise(requestAction)
    .then((response) => {
      const { body } = response;

      if (+response.statusCode >= 400) {
        const error = getError(response);
        return handleError({ id, type, error, requestAction }, next);
      }

      const duration = new Date() - start;
      log((id ? type + ': ' + id : type), duration + 'ms');
      return next({ id, type, data: body, config: requestAction });
    })
    .catch(({ error }) => handleError({ id, type, error, requestAction }, next));
};

module.exports = {
  doRequestMiddleware,
  getError
};
