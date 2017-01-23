'use strict';
import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { useScroll } from 'react-router-scroll';
import { Router, Route, IndexRoute, hashHistory, applyRouterMiddleware } from 'react-router';

import config from './config';
import reducers from './reducers';

const store = createStore(reducers, applyMiddleware(thunkMiddleware));

console.log.apply(console, config.consoleMessage);
console.log('Environment', config.environment);

import NotFound from './components/404';
import App from './components/app';
import Home from './components/home';
import Collections from './components/collections';
import Granules from './components/granules';

render((
  <Provider store={store}>
    <Router history={hashHistory} render={applyRouterMiddleware(useScroll())}>
      <Route path='/404' component={NotFound} />
      <Route path='/' component={App}>
        <IndexRoute component={Home} />

        <Route path='collections' component={Collections} />
        <Route path='granules' component={Granules} />
      </Route>
    </Router>
  </Provider>
), document.getElementById('site-canvas'));
