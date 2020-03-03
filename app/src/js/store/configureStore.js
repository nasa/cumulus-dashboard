import { createBrowserHistory } from 'history';
import { applyMiddleware, compose, createStore } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import { createRootReducer } from '../reducers';
import { refreshTokenMiddleware } from '../middleware/token';
import { requestMiddleware } from '../middleware/request';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { window } from '../utils/browser';
import config from '../config';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const history = createBrowserHistory();

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
  thunk
];

if (isDevelopment) {
  const logger = createLogger({
    collapsed: true
  });

  middlewares.push(logger);
}

// create the store and build redux middleware
export default function configureStore (preloadedState) {
  const store = createStore(
    createRootReducer(history), // root reducer with router state
    preloadedState,
    composeEnhancers(
      applyMiddleware(...middlewares),
    ),
  );

  if (window.Cypress && window.Cypress.env('TESTING') === true) {
    window.appStore = store;
  }

  return store;
}
