'use strict';
import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider as ProviderElem } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { useScroll } from 'react-router-scroll';
import {
  Router,
  Route,
  IndexRoute,
  Redirect,
  hashHistory,
  applyRouterMiddleware
} from 'react-router';

import config from './config';
import reducers from './reducers';

const store = createStore(reducers, applyMiddleware(thunkMiddleware));

console.log.apply(console, config.consoleMessage);
console.log('Environment', config.environment);

import NotFound from './components/404';
import App from './components/app';
import Login from './components/app/login';
import Home from './components/home';

import Collections from './components/collections';
import CollectionList from './components/collections/list';
import AddCollection from './components/collections/add';
import EditCollection from './components/collections/edit';
import CollectionOverview from './components/collections/overview';
import CollectionGranules from './components/collections/granules';
import CollectionIngest from './components/collections/ingest';
import CollectionLogs from './components/collections/logs';

import Granules from './components/granules';
import ListGranules from './components/granules/list';
import GranuleOverview from './components/granules/granule';
import GranuleRecipeIngest from './components/granules/recipe-ingest';

import Pdrs from './components/pdr';
import Pdr from './components/pdr/pdr';
import PdrOverview from './components/pdr/overview';
import PdrList from './components/pdr/list';

import Providers from './components/providers';
import AddProvider from './components/providers/add';
import EditProvider from './components/providers/edit';
import ProvidersOverview from './components/providers/overview';
import Provider from './components/providers/provider';
import ListProviders from './components/providers/list';

import Resources from './components/resources';

import Logs from './components/logs';

// redirect to login when not auth'd
function requireAuth (nextState, replace) {
  if (!store.getState().api.authenticated) {
    replace('/login');
  }
}

render((
  <ProviderElem store={store}>
    <Router history={hashHistory} render={applyRouterMiddleware(useScroll())}>
      <Route path='/404' component={NotFound} />
      <Redirect from='/collections' to='/collections/active' />
      <Route path='/login' component={Login} />
      <Route path='/' component={App} onEnter={requireAuth} >
        <IndexRoute component={Home} />
        <Route path='collections' component={Collections}>
          <Route path='active' component={CollectionList} />
          <Route path='inactive' component={CollectionList} />
          <Route path='add' component={AddCollection} />
          <Route path='edit/:collectionName' component={EditCollection} />
          <Route path='collection/:collectionName' component={CollectionOverview} />
          <Route path='collection/:collectionName/granules' component={CollectionGranules} />
          <Route path='collection/:collectionName/ingest' component={CollectionIngest} />
          <Route path='collection/:collectionName/logs' component={CollectionLogs} />
        </Route>
        <Route path='granules' component={Granules}>
          <IndexRoute component={ListGranules} />
          <Route path='granule/:granuleId/overview' component={GranuleOverview} />
          <Route path='granule/:granuleId/recipe-ingest' component={GranuleRecipeIngest} />
          <Route path='completed' component={ListGranules} />
          <Route path='processing' component={ListGranules} />
          <Route path='failed' component={ListGranules} />
        </Route>
        <Route path='pdrs' component={Pdrs}>
          <IndexRoute component={PdrOverview} />
          <Route path='active' component={PdrList} />
          <Route path='failed' component={PdrList} />
          <Route path='completed' component={PdrList} />
          <Route path='pdr/:pdrName' component={Pdr} />
        </Route>
        <Route path='providers' component={Providers}>
          <IndexRoute component={ProvidersOverview} />
          <Route path='add' component={AddProvider} />
          <Route path='edit/:providerId' component={EditProvider} />
          <Route path='active' component={ListProviders} />
          <Route path='inactive' component={ListProviders} />
          <Route path='failed' component={ListProviders} />
          <Route path='provider/:providerId' component={Provider} />
        </Route>
        <Route path='logs' component={Logs} />
        <Route path='resources' component={Resources} />
      </Route>
    </Router>
  </ProviderElem>
), document.getElementById('site-canvas'));
