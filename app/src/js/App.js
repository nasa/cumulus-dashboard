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

import Granules from './components/Granules';
import ListGranules from './components/Granules/list';
import GranuleOverview from './components/Granules/granule';
import GranulesOverview from './components/Granules/overview';

import Pdrs from './components/Pdr';
import Pdr from './components/Pdr/pdr';
import PdrOverview from './components/Pdr/overview';
import PdrList from './components/Pdr/list';

import Providers from './components/Providers';
import AddProvider from './components/Providers/add';
import EditProvider from './components/Providers/edit';
import ProvidersOverview from './components/Providers/overview';
import ProviderOverview from './components/Providers/provider';

import Workflows from './components/Workflows';
import WorkflowsOverview from './components/Workflows/overview';
import Workflow from './components/Workflows/workflow';

import Executions from './components/Executions';
import ExecutionOverview from './components/Executions/overview';
import ExecutionStatus from './components/Executions/execution-status';
import ExecutionLogs from './components/Executions/execution-logs';

import Operations from './components/Operations';
import OperationOverview from './components/Operations/overview';

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
      <div className="routes">
        <Provider store={this.store}>
          <ConnectedRouter history={history}>
            <Switch>
              <Redirect exact from='/login' to='/auth' />
              <Route path='/auth' component={OAuth} onEnter={checkAuth(this.store)} />
              <Main path='/' onEnter={requireAuth(this.store)} >
                <Route exact path='/' component={Home} />
                <Switch>
                  <Route path='/404' component={NotFound} />
                  <Route path='/collections' component={Collections} />
                  <Route path='/granules' component={Granules} />
                  <Route path='/pdrs' component={Pdrs} />
                  <Route path='/providers' component={Providers} />
                  <Route path='/workflows' component={Workflows} />
                  <Route path='/executions' component={Executions} />
                  <Route path='/operations' component={Operations} />
                  <Route path='/rules' component={Rules} />
                  <Route path='/logs' component={Logs} />
                  <Route path='/reconciliation-reports' component={ReconciliationReports} />

                  {/*
                    Move the following Switch (and related imports) to the
                    Granules component, replacing the existing {this.props.children}
                  */}
                  <Switch>
                    <Route exact path='/granules' component={GranulesOverview} />
                    <Route path='/granules/granule/:granuleId' component={GranuleOverview} />
                    <Route path='/granules/granule/:granuleId/completed' component={ListGranules} />
                    <Route path='/granules/granule/:granuleId/processing' component={ListGranules} />
                    <Route path='/granules/granule/:granuleId/failed' component={ListGranules} />
                    <Redirect exact from='/granules/running' to='/granules/processing' />
                  </Switch>

                  {/*
                    Move the following Switch (and related imports) to the
                    Pdrs component, replacing the existing {this.props.children}
                  */}
                  <Switch>
                    <Route exact path='/pdrs' component={PdrOverview} />
                    <Route path='/pdrs/active' component={PdrList} />
                    <Route path='/pdrs/failed' component={PdrList} />
                    <Route path='/pdrs/completed' component={PdrList} />
                    <Route path='/pdrs/pdr/:pdrName' component={Pdr} />
                  </Switch>

                  {/*
                    Move the following Switch (and related imports) to the
                    Providers component, replacing the existing {this.props.children}
                  */}
                  <Switch>
                    <Route exact path='/providers' component={ProvidersOverview} />
                    <Route path='/providers/add' component={AddProvider} />
                    <Route path='/providers/edit/:providerId' component={EditProvider} />
                    <Route path='/providers/provider/:providerId' component={ProviderOverview} />
                  </Switch>

                  {/*
                    Move the following Switch (and related imports) to the
                    Workflows component, replacing the existing {this.props.children}
                  */}
                  <Switch>
                    <Route exact path='/workflows' component={WorkflowsOverview} />
                    <Route path='/workflows/workflow/:workflowName' component={Workflow} />
                  </Switch>

                  {/*
                    Move the following Switch (and related imports) to the
                    Executions component, replacing the existing {this.props.children}
                  */}
                  <Switch>
                    <Route exact path='/executions' component={ExecutionOverview} />
                    <Route path='/executions/execution/:executionArn' component={ExecutionStatus} />
                    <Route path='/executions/execution/:executionName/logs' component={ExecutionLogs} />
                  </Switch>

                  {/*
                    Move the following (and related imports) to the
                    Operations component, replacing the existing {this.props.children}
                  */}
                  <Route exact path='/operations' component={OperationOverview} />

                  {/*
                    Move the following Switch (and related imports) to the
                    Rules component, replacing the existing {this.props.children}
                  */}
                  <Switch>
                    <Route exact path='/rules' component={RulesOverview} />
                    <Route path='/rules/rule/:ruleName' component={Rule} />
                    <Route path='/rules/edit/:ruleName' component={EditRule} />
                    <Route path='/rules/add' component={AddRule} />
                  </Switch>

                  {/*
                    Move the following Switch (and related imports) to the
                    ReconciliationReports component, replacing the existing {this.props.children}
                  */}
                  <Switch>
                    <Route exact path='/reconciliation-reports' component={ReconciliationReportList} />
                    <Route path='/reconciliation-reports/report/:reconciliationReportName' component={ReconciliationReport} />
                  </Switch>
                </Switch>
              </Main>
            </Switch>
          </ConnectedRouter>
        </Provider>
      </div>
    );
  }
}

export default App;
