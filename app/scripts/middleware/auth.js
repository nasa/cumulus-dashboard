import { CALL_API } from '../actions';
import { configureRequest } from '../actions/helpers';

const addRequestAuthMiddleware = ({ dispatch, getState }) => next => action => {
  const requestAction = action[CALL_API];
  if (!requestAction) {
    return next(action);
  }

  configureRequest(requestAction);

  let token = getState().api.tokens.token;
  if (token) {
    requestAction.headers = requestAction.headers || {};
    requestAction.headers.Authorization = 'Bearer ' + token;
  }

  return next(action);
};

module.exports = {
  addRequestAuthMiddleware
};
