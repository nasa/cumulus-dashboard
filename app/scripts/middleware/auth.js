import { CALL_API } from '../actions';
import { configureRequest } from '../actions/helpers';

const addRequestAuthMiddleware = ({ getState }) => next => action => {
  const requestAction = action[CALL_API];
  if (!requestAction) {
    return next(action);
  }

  const config = configureRequest(requestAction);

  let token = getState().api.tokens.token;
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = 'Bearer ' + token;
  }

  requestAction.config = config;

  return next(action);
};

module.exports = {
  addRequestAuthMiddleware
};
