import { CALL_API } from '../actions';

const addRequestAuthMiddleware = ({ getState }) => next => action => {
  let requestAction = action[CALL_API];
  if (!requestAction) {
    return next(action);
  }

  let token = getState().api.tokens.token;

  if (token) {
    requestAction = Object.assign({}, requestAction, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  action = Object.assign({}, {
    [CALL_API]: requestAction
  });

  return next(action);
};

module.exports = {
  addRequestAuthMiddleware
};
