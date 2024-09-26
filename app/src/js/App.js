import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
  <BrowserRouter>
    <Routes>
      <Main path={'/'}>
        <Route exact path={'/'} element={<Home />}></Route>
        <Route path={'/404'} element={<NotFound />}></Route>
        <Route path={'/collections'} element={<Collections />}></Route>
        <Route path={'/granules'} element={<Granules />}></Route>
        <Route path={'/pdrs'} element={<Pdrs />}></Route>
        <Route path={'/providers'} element={<Providers />}></Route>
        <Route path={'/workflows'} element={<Workflows />}></Route>
        <Route path={'/executions'} element={<Executions />}></Route>
        <Route path={'/operations'} element={<Operations />}></Route>
        <Route path={'/rules'} element={<Rules />}></Route>
        <Route path={'/reconciliation-reports'} element={<ReconciliationReports />}></Route>
      </Main>
    </Routes>
  </BrowserRouter>
);

// generate the root App Component
const App = () => {
  const [store] = useState(ourConfigureStore({}));
  const isLoggedIn = () => store.getState().api.authenticated;

  return (
      // <ErrorBoundary> // Add after troublshooting other errors
      // Routes
      <div className="routes">
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <Routes>
              <Navigate exact from='/login' to='/auth' />
              <Route path='/auth' render={() => (isLoggedIn() ? <Navigate to='/' /> : <OAuth />)} />
              <Route path='/' render={() => (isLoggedIn() ? <MainRoutes /> : <Navigate to='/auth' />)} />
            </Routes>
          </ConnectedRouter>
        </Provider>
      </div>
  );
};

export default App;
