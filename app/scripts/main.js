'use strict';
import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
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
import Home from './components/home';

import Collections from './components/collections';
import ActiveCollections from './components/collections/active';
import InactiveCollections from './components/collections/inactive';
import AddCollection from './components/collections/add';
import EditCollection from './components/collections/edit';
import CollectionOverview from './components/collections/overview';
import CollectionGranules from './components/collections/granules';
import CollectionIngest from './components/collections/ingest';
import CollectionLogs from './components/collections/logs';

import Granules from './components/granules';
import ListGranules from './components/granules/all-granules';
import GranuleOverview from './components/granules/granule';
import GranuleRecipe from './components/granules/granule-recipe';
import MarkedDeletion from './components/granules/marked-deletion';
import Restricted from './components/granules/restricted';

import Pdrs from './components/pdr';
import listPdrs from './components/pdr/list';
import Pdr from './components/pdr/pdr';
import ActivePdrs from './components/pdr/active';
import PdrCompleted from './components/pdr/completed';

import Logs from './components/logs';
import Contact from './components/contact';

render((
  <Provider store={store}>
    <Router history={hashHistory} render={applyRouterMiddleware(useScroll())}>
      <Route path='/404' component={NotFound} />
      <Redirect from='/collections' to='/collections/active' />
      <Route path='/' component={App}>
        <IndexRoute component={Home} />
        <Route path='collections' component={Collections}>
          <Route path='active' component={ActiveCollections} />
          <Route path='inactive' component={InactiveCollections} />
          <Route path='add' component={AddCollection} />
          <Route path='edit/:collectionName' component={EditCollection} />
          <Route path='collection/:collectionName' component={CollectionOverview} />
          <Route path='collection/:collectionName/granules' component={CollectionGranules} />
          <Route path='collection/:collectionName/ingest' component={CollectionIngest} />
          <Route path='collection/:collectionName/logs' component={CollectionLogs} />
        </Route>
        <Route path='granules' component={Granules}>
          <IndexRoute component={ListGranules} />
          <Route path='pdr/:pdrName' component={ListGranules} />
          <Route path='granule/:granuleId/overview' component={GranuleOverview} />
          <Route path='granule/:granuleId/recipe-ingest' component={GranuleRecipe} />
          <Route path='deletion' component={MarkedDeletion} />
          <Route path='restricted' component={Restricted} />
        </Route>
        <Route path='pdrs' component={Pdrs}>
          <IndexRoute component={listPdrs} />
          <Route path='active' component={ActivePdrs} />
          <Route path='completed' component={PdrCompleted} />
          <Route path='pdr/:pdrName' component={Pdr} />
        </Route>
        <Route path='logs' component={Logs} />
        <Route path='contact' component={Contact} />
      </Route>
    </Router>
  </Provider>
), document.getElementById('site-canvas'));
