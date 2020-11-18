import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Route, Redirect, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';

import ourConfigureStore, { history } from './store/configureStore';

// Authorization & Error Handling
// import ErrorBoundary from './components/Errors/ErrorBoundary';
import NotFound from './components/404';
import OAuth from './components/oauth';

// Components
import Home from './components/home';
import Main from './main';
import Collections from './components/Collections';
import Granules from './components/Granules';
import Pdrs from './components/Pdr';
import Providers from './components/Providers';
import Workflows from './components/Workflows';
import Executions from './components/Executions';
import Operations from './components/Operations';
import Rules from './components/Rules';
import ReconciliationReports from './components/ReconciliationReports';

import config from './config';

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
