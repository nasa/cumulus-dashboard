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
import OAuth from './components/app/oauth';
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
import Granule from './components/granules/granule';
import GranuleOverview from './components/granules/overview';

import Pdrs from './components/pdr';
import Pdr from './components/pdr/pdr';
import PdrOverview from './components/pdr/overview';
import PdrList from './components/pdr/list';

import Providers from './components/providers';
import AddProvider from './components/providers/add';
import EditProvider from './components/providers/edit';
import ProvidersOverview from './components/providers/overview';
import Provider from './components/providers/provider';

import Workflows from './components/workflows';
import WorkflowsOverview from './components/workflows/overview';
import Workflow from './components/workflows/workflow';

import Executions from './components/executions';
import ExecutionsOverview from './components/executions/overview';
import ExecutionStatus from './components/executions/execution-status';

import Rules from './components/rules';
import RulesOverview from './components/rules/overview';
import Rule from './components/rules/rule';
import EditRule from './components/rules/edit';
import AddRule from './components/rules/add';

import Logs from './components/logs';

import ReconciliationReports from './components/reconciliation-reports';
import ReconciliationReportList from './components/reconciliation-reports/list';
import ReconciliationReport from './components/reconciliation-reports/reconciliation-report';

// redirect to login when not auth'd
function requireAuth (nextState, replace) {
  if (!store.getState().api.authenticated) {
    replace('/auth');
  }
}

// redirect to homepage from login if authed
function checkAuth (nextState, replace) {
  if (store.getState().api.authenticated) {
    replace('/');
  }
}

render((
  <ProviderElem store={store}>
    <Router history={hashHistory} render={applyRouterMiddleware(useScroll())}>
      <Route path='/404' component={NotFound} />
      <Redirect from='/collections' to='/collections/all' />
      <Redirect from='/login' to='/auth' />
      <Route path='/auth' component={OAuth} onEnter={checkAuth} />
      <Route path='/' component={App} onEnter={requireAuth} >
        <IndexRoute component={Home} />
        <Route path='collections' component={Collections}>
          <Route path='all' component={CollectionList} />
          <Route path='add' component={AddCollection} />
          <Route path='edit/:name/:version' component={EditCollection} />
          <Route path='collection/:name/:version' component={CollectionOverview} />
          <Route path='collection/:name/:version/granules' component={CollectionGranules} />
          <Route path='collection/:name/:version/definition' component={CollectionIngest} />
          <Route path='collection/:name/:version/logs' component={CollectionLogs} />
        </Route>
        <Route path='granules' component={Granules}>
          <IndexRoute component={GranuleOverview} />
          <Route path='granule/:granuleId' component={Granule} />
          <Route path='completed' component={ListGranules} />
          <Route path='processing' component={ListGranules} />
          <Route path='failed' component={ListGranules} />
          <Redirect from='running' to='processing' />
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
          <Route path='provider/:providerId' component={Provider} />
        </Route>
        <Route path='workflows' component={Workflows}>
          <IndexRoute component={WorkflowsOverview} />
          <Route path='workflow/:workflowName' component={Workflow} />
        </Route>
        <Route path='executions' component={Executions}>
          <IndexRoute component={ExecutionsOverview} />
          <Route path='execution/:executionArn' component={ExecutionStatus} />
        </Route>
        <Route path='rules' component={Rules}>
          <IndexRoute component={RulesOverview} />
          <Route path='rule/:ruleName' component={Rule} />
          <Route path='edit/:ruleName' component={EditRule} />
          <Route path='add' component={AddRule} />
        </Route>
        <Route path='logs' component={Logs} />
        <Route path='reconciliation-reports' component={ReconciliationReports}>
          <IndexRoute component={ReconciliationReportList} />
          <Route path='reconciliation-reports/:reconciliationReportName' component={ReconciliationReport} />
        </Route>
      </Route>
    </Router>
  </ProviderElem>
), document.getElementById('site-canvas'));
