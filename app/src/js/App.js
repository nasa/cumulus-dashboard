'use strict';
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import configureStore, { requireAuth, checkAuth, history } from './store/configureStore';
import { Route, Redirect, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
// import { useScroll as notHookUseScroll } from 'react-router-scroll-4';

//  Fontawesome Icons Library
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSignOutAlt, faSearch, faSync, faPlus, faInfoCircle, faTimesCircle, faSave, faCalendar, faExpand, faCompress, faClock, faCaretDown, faChevronDown, faSort, faSortDown, faSortUp, faArrowAltCircleLeft, faArrowAltCircleRight, faArrowAltCircleDown, faArrowAltCircleUp, faArrowRight, faCopy, faEdit, faArchive, faLaptopCode, faServer, faHdd, faExternalLinkSquareAlt, faToggleOn, faToggleOff, faExclamationTriangle, faCoins, faCheckCircle, faCircle } from '@fortawesome/free-solid-svg-icons';
library.add(faSignOutAlt, faSearch, faSync, faPlus, faInfoCircle, faTimesCircle, faSave, faCalendar, faExpand, faCompress, faClock, faCaretDown, faSort, faChevronDown, faSortDown, faSortUp, faArrowAltCircleLeft, faArrowAltCircleRight, faArrowAltCircleDown, faArrowAltCircleUp, faArrowRight, faCopy, faEdit, faArchive, faLaptopCode, faServer, faHdd, faExternalLinkSquareAlt, faToggleOn, faToggleOff, faExclamationTriangle, faCoins, faCheckCircle, faCircle);

// Authorization & Error Handling
// import ErrorBoundary from './components/Errors/ErrorBoundary';
import NotFound from './components/404';
import OAuth from './components/oauth';

// Components
import Home from './components/home';
import Main from '../js/main';
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
import ProviderElem from './components/Providers/provider';

import Workflows from './components/Workflows';
import WorkflowsOverview from './components/Workflows/overview';
import Workflow from './components/Workflows/workflow';

import Executions from './components/Executions';
import ExecutionsOverview from './components/Executions/overview';
import ExecutionStatus from './components/Executions/execution-status';
import ExecutionLogs from './components/Executions/execution-logs';

import Operations from './components/Operations';
import OperationsOverview from './components/Operations/overview';

import Rules from './components/Rules';
import RulesOverview from './components/Rules/overview';
import Rule from './components/Rules/rule';
import EditRule from './components/Rules/edit';
import AddRule from './components/Rules/add';

import Logs from './components/Logs';

import ReconciliationReports from './components/ReconciliationReports';
import ReconciliationReportList from './components/ReconciliationReports/list';
import ReconciliationReport from './components/ReconciliationReports/reconciliation-report';

import config from './config';

console.log.apply(console, config.consoleMessage);
console.log('Environment', config.environment);

// generate the root App Component
class App extends Component {
  constructor (props) {
    super(props);
    this.state = {};
    this.store = configureStore({});
  }

  render () {
    return (
      // <ErrorBoundary> // Add after troublshooting other errors
      // Routes
      <Provider store={this.store}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path='/404' component={NotFound} />
            <Redirect exact from='/collections' to='/collections/all' />
            <Redirect exact from='/login' to='/auth' />
            <Route path='/auth' component={OAuth} onEnter={checkAuth(this.store)} />
          </Switch>
          <Route path='/' component={Main} onEnter={requireAuth(this.store)} >
            <Switch>
              <Route exact path='/' component={Home} />
              { /* Collections */}
              <Route path='collections' component={Collections}>
                <Route path='all' component={CollectionList} />
                <Route path='add' component={AddCollection} />
                <Route path='edit/:name/:version' component={EditCollection} />
                <Route path='collection/:name/:version' component={CollectionOverview} />
                { /* Collections - Granules */}
                <Route path='collection/:name/:version/granules' component={CollectionGranules}>
                  <Route path='completed' component={CollectionGranules} />
                  <Route path='processing' component={CollectionGranules} />
                  <Route path='failed' component={CollectionGranules} />
                  <Redirect exact from='running' to='processing' />
                </Route>
                <Route path='collection/:name/:version/definition' component={CollectionIngest} />
                <Route path='collection/:name/:version/logs' component={CollectionLogs} />
              </Route>
              { /* Granules */}
              <Route path='granules' component={Granules}>
                <Route exact path='/' component={GranuleOverview} />
                <Route path='granule/:granuleId' component={Granule} />
                <Route path='completed' component={ListGranules} />
                <Route path='processing' component={ListGranules} />
                <Route path='failed' component={ListGranules} />
                <Redirect exact from='running' to='processing' />
              </Route>
              { /* PDRs */}
              <Route path='pdrs' component={Pdrs}>
                <Route exact path='/' component={PdrOverview} />
                <Route path='active' component={PdrList} />
                <Route path='failed' component={PdrList} />
                <Route path='completed' component={PdrList} />
                <Route path='pdr/:pdrName' component={Pdr} />
              </Route>
              { /* Providers */}
              <Route path='providers' component={Providers}>
                <Route exact path='/' component={ProvidersOverview} />
                <Route path='add' component={AddProvider} />
                <Route path='edit/:providerId' component={EditProvider} />
                <Route path='provider/:providerId' component={ProviderElem} />
              </Route>
              { /* Workflows */}
              <Route path='workflows' component={Workflows}>
                <Route exact path='/' component={WorkflowsOverview} />
                <Route path='workflow/:workflowName' component={Workflow} />
              </Route>
              { /* Executions */}
              <Route path='executions' component={Executions}>
                <Route exact path='/' component={ExecutionsOverview} />
                <Route path='execution/:executionArn' component={ExecutionStatus} />
              </Route>
              <Route path='executions' component={Executions}>
                <Route exact path='/' component={ExecutionsOverview} />
                <Route path='execution/:executionName/logs' component={ExecutionLogs} />
              </Route>
              { /* Operations */}
              <Route path='operations' component={Operations}>
                <Route exact path='/' component={OperationsOverview} />
              </Route>
              { /* Rules */}
              <Route path='rules' component={Rules}>
                <Route exact path='/' component={RulesOverview} />
                <Route path='rule/:ruleName' component={Rule} />
                <Route path='edit/:ruleName' component={EditRule} />
                <Route path='add' component={AddRule} />
              </Route>
              { /* Logs */}
              <Route path='logs' component={Logs} />
              { /* Reports */}
              <Route path='reconciliation-reports' component={ReconciliationReports}>
                <Route exact path='/' component={ReconciliationReportList} />
                <Route path='report/:reconciliationReportName' component={ReconciliationReport} />
              </Route>
            </Switch>
          </Route>
        </ConnectedRouter>
      </Provider>
      // </ErrorBoundary>
    );
  }
}

export default App;
