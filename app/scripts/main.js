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
import ActiveCollections from './components/collections/active';
import AddCollection from './components/collections/add';
import CollectionErrors from './components/collections/collection-errors';
import CollectionGranules from './components/collections/collection-granules';
import CollectionIngest from './components/collections/collection-ingest';
import CollectionLogs from './components/collections/collection-logs';
import Collection from './components/collections/collection';
import Granules from './components/granules';
import Overview from './components/granules/overview';
import GranuleIngest from './components/granules/granule-ingest';
import Granule from './components/granules/granule';
import AllGranules from './components/granules/all-granules';
import Errors from './components/granules/errors';
import MarkedDeletion from './components/granules/marked-deletion';
import Restricted from './components/granules/restricted';
import Pdrs from './components/pdr';
import Pdr from './components/pdr/pdr';
import PdrActive from './components/pdr/active';
import PdrCompleted from './components/pdr/completed';
import PdrErrors from './components/pdr/errors';


render((
  <Provider store={store}>
    <Router history={hashHistory} render={applyRouterMiddleware(useScroll())}>
      <Route path='/404' component={NotFound} />
      <Route path='/' component={App}>
        <IndexRoute component={Home} />

        <Route path='collections' component={Collections}>
          <IndexRoute component={ActiveCollections} />
          <Route path='add' component={AddCollection} />
          <Route path='collection-errors' component={CollectionErrors} />
          <Route path='collection-granules' component={CollectionGranules} />
          <Route path='collection-ingest' component={CollectionIngest} />
          <Route path='collection-logs' component={CollectionLogs} />
          <Route path='collection' component={Collection} />
        </Route>
        <Route path='granules' component={Granules}>
          <IndexRoute component={Overview} />
          <Route path='granule-ingest' component={GranuleIngest} />
          <Route path='granule' component={Granule} />
          <Route path='all-granules' component={AllGranules} />
          <Route path='errors' component={Errors} />
          <Route path='marked-deletion' component={MarkedDeletion} />
          <Route path='restricted' component={Restricted} />
        </Route>
        <Route path='pdrs' component={Pdrs}>
          <Route path='active' component={PdrActive} />
          <Route path='completed' component={PdrCompleted} />
          <Route path='errors' component={PdrErrors} />
          <Route path='pdr' component={Pdr} />
        </Route>
      </Route>
    </Router>
  </Provider>
), document.getElementById('site-canvas'));
