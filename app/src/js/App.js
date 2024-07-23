import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Route, Redirect, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';

import ourConfigureStore, { history } from './store/configureStore.js';

// Authorization & Error Handling
// import ErrorBoundary from './components/Errors/ErrorBoundary.js';
import NotFound from './components/404.js';
import OAuth from './components/oauth.js';

// Components
import Home from './components/home.js';
import Main from './main.js';
import Collections from './components/Collections/index.js';
import Granules from './components/Granules/index.js';
import Pdrs from './components/Pdr/index.js';
import Providers from './components/Providers/index.js';
import Workflows from './components/Workflows/index.js';
import Executions from './components/Executions/index.js';
import Operations from './components/Operations/index.js';
import Rules from './components/Rules/index.js';
import ReconciliationReports from './components/ReconciliationReports/index.js';

import config from './config/index.js';

console.log('Environment', config.environment);

// Wrapper for Main component to include routing
const MainRoutes = () => (
  <Main path='/'>
    <Switch>
      <Route exact path='/' component={Home} />
      <Route path='/404' component={NotFound} />
      <Route path='/collections' component={Collections} />
      <Route path='/granules' component={Granules} />
      <Route path='/pdrs' component={Pdrs} />
      <Route path='/providers' component={Providers} />
      <Route path='/workflows' component={Workflows} />
      <Route path='/executions' component={Executions} />
      <Route path='/operations' component={Operations} />
      <Route path='/rules' component={Rules} />
      <Route path='/reconciliation-reports' component={ReconciliationReports} />
    </Switch>
  </Main>
);

// generate the root App Component
class App extends Component {
  constructor (props) {
    super(props);
    this.state = {};
    this.store = ourConfigureStore({});
    this.isLoggedIn = this.isLoggedIn.bind(this);
  }

  isLoggedIn () {
    return this.store.getState().api.authenticated;
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
              <Route path='/auth' render={() => (this.isLoggedIn() ? <Redirect to='/' /> : <OAuth />)} />
              <Route path='/' render={() => (this.isLoggedIn() ? <MainRoutes /> : <Redirect to='/auth' />)} />
            </Switch>
          </ConnectedRouter>
        </Provider>
      </div>
    );
  }
}

export default App;
