/* eslint-disable import/no-cycle */
import { createHashHistory, createBrowserHistory } from 'history';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { routerMiddleware } from 'connected-react-router';
import { createLogger } from 'redux-logger';
import { createRootReducer } from '../reducers';
import { refreshTokenMiddleware } from '../middleware/token';
import { requestMiddleware } from '../middleware/request';
import { window } from '../utils/browser';
import config from '../config';

let historyCreator;

if (typeof document !== 'undefined') {
  historyCreator = config.servedByCumulusAPI ? createHashHistory({}) : createBrowserHistory({});
}

export const history = historyCreator;

// redirect to login when not auth'd
export const requireAuth = (store) => (nextState, replace) => {
  if (!store.getState().api.authenticated) {
    replace('/auth');
  }
};

// redirect to homepage from login if authed
export const checkAuth = (store) => (nextState, replace) => {
  if (store.getState().api.authenticated) {
    replace('/');
  }
};

const isDevelopment = config.environment === 'development';

const middlewares = [
  routerMiddleware(history), // for dispatching history actions
  refreshTokenMiddleware,
  requestMiddleware,
  ...getDefaultMiddleware()
];

if (isDevelopment) {
  const logger = createLogger({
    collapsed: true
  });

  middlewares.push(logger);
}

// create the store and build redux middleware
export default function ourConfigureStore (preloadedState) {
  const store = configureStore({
    reducer: createRootReducer(history), // root reducer with router state
    middleware: middlewares,
    preloadedState
  });

  if (window && window.Cypress && window.Cypress.env('TESTING') === true) {
    window.appStore = store;
  }

  return store;
}
