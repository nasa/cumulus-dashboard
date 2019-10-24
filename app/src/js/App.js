'use strict';
import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider as ProviderElem } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { useScroll as notHookUseScroll } from 'react-router-scroll';
//  Fontawesome Icons Library
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSignOutAlt, faSearch, faPlus, faInfoCircle, faTimesCircle, faSave, faCalendar, faExpand, faCompress, faClock, faCaretDown, faSort, faSortDown, faSortUp, faArrowAltCircleLeft, faArrowAltCircleRight, faArrowAltCircleDown, faArrowAltCircleUp, faCopy, faEdit, faArchive, faLaptopCode, faServer, faHdd, faExternalLinkSquareAlt, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
library.add(faSignOutAlt, faSearch, faPlus, faInfoCircle, faTimesCircle, faSave, faCalendar, faExpand, faCompress, faClock, faCaretDown, faSort, faSortDown, faSortUp, faArrowAltCircleLeft, faArrowAltCircleRight, faArrowAltCircleDown, faArrowAltCircleUp, faCopy, faEdit, faArchive, faLaptopCode, faServer, faHdd, faExternalLinkSquareAlt, faToggleOn, faToggleOff);
import {
  Router,
  Route,
  IndexRoute,
  Redirect,
  applyRouterMiddleware,
  useRouterHistory as notHookUseRouterHistory
} from 'react-router';
import { createHashHistory } from 'history';

import config from './config';
import reducers from './reducers';
import { refreshTokenMiddleware } from './middleware/token';
import { requestMiddleware } from './middleware/request';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducers,
                          composeEnhancers(
                            applyMiddleware(
                              refreshTokenMiddleware,
                              requestMiddleware,
                              thunkMiddleware
                            )));

if (window.Cypress && window.Cypress.env('TESTING') === true) {
  window.appStore = store;
}

console.log.apply(console, config.consoleMessage);
console.log('Environment', config.environment);

import NotFound from './components/404';
import App from '..';
import OAuth from './components/oauth';
import Home from './components/home';

import Collections from './components/Collections';
import CollectionList from './components/Collections/list';
import AddCollection from './components/Collections/add';
import EditCollection from './components/Collections/edit';
import CollectionOverview from './components/Collections/overview';
import CollectionGranules from './components/Collections/granules';
import CollectionIngest from './components/Collections/ingest';
import CollectionLogs from './components/Collections/logs';

import Granules from './components/Granules';
import ListGranules from './components/Granules/list';
import Granule from './components/Granules/granule';
import GranuleOverview from './components/Granules/overview';

import Pdrs from './components/Pdr';
import Pdr from './components/Pdr/pdr';
import PdrOverview from './components/Pdr/overview';
import PdrList from './components/Pdr/list';

import Providers from './components/Providers';
import AddProvider from './components/Providers/add';
import EditProvider from './components/Providers/edit';
import ProvidersOverview from './components/Providers/overview';
import Provider from './components/Providers/provider';

import Workflows from './components/Workflows';
import WorkflowsOverview from './components/Workflows/overview';
import Workflow from './components/Workflows/workflow';

import Executions from './components/Executions';
import ExecutionsOverview from './components/Executions/overview';
import ExecutionStatus from './components/Executions/execution-status';
import ExecutionLogs from './components/Executions/execution-logs';

import Rules from './components/Rules';
import RulesOverview from './components/Rules/overview';
import Rule from './components/Rules/rule';
import EditRule from './components/Rules/edit';
import AddRule from './components/Rules/add';

import Logs from './components/Logs';

import ReconciliationReports from './components/ReconciliationReports';
import ReconciliationReportList from './components/ReconciliationReports/list';
import ReconciliationReport from './components/ReconciliationReports/reconciliation-report';

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
    <Router history={notHookUseRouterHistory(createHashHistory)()} render={applyRouterMiddleware(notHookUseScroll())}>
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
        <Route path='executions' component={Executions}>
          <IndexRoute component={ExecutionsOverview} />
          <Route path='execution/:executionName/logs' component={ExecutionLogs} />
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
          <Route path='report/:reconciliationReportName' component={ReconciliationReport} />
        </Route>
      </Route>
    </Router>
  </ProviderElem>
), document.getElementById('site-canvas'));
