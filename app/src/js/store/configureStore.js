/* eslint-disable import/no-cycle */
import React from 'react';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import { Navigate } from 'react-router-dom';
import { createRootReducer } from '../reducers';
import { refreshTokenMiddleware } from '../middleware/token';
import { requestMiddleware } from '../middleware/request';
import { window } from '../utils/browser';
import config from '../config';

export const requireAuth = (store) => {
  if (!store.getState().api.authenticated) {
    return <Navigate to="/auth" />;
  }
  return null;
};

export const checkAuth = (store) => {
  if (store.getState().api.authenticated) {
    return <Navigate to="/" />;
  }
  return null;
};

const isDevelopment = config.environment === 'development';

const middlewares = [
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
    reducer: createRootReducer(),
    middleware: middlewares,
    preloadedState
  });

  if (window && window.Cypress && window.Cypress.env('TESTING') === true) {
    window.appStore = store;
  }

  return store;
}
