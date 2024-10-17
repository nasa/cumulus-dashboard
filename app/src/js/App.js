import React, { useState } from 'react';
import { Provider, useSelector } from 'react-redux';
import {
  Routes,
  Route,
  Navigate,
  BrowserRouter,
} from 'react-router-dom';
import ourConfigureStore from './store/configureStore';

// Authorization & Error Handling
import ErrorBoundary from './components/Errors/ErrorBoundary';
import NotFound from './components/404';
import OAuth from './components/oauth';

// Components
import Home from './components/home';
import Main from './main'; // Outlet calls to Main component
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

// Establish auth and login rules if user is or is not authenticated via Launchpad
const AuthenicatedRoute = () => {
  const isAuthenticated = useSelector((state) => state.api.authenticated);
  console.log('Authentication status:', isAuthenticated);
  return isAuthenticated ? <Main /> : <Navigate to='auth' replace />;
};

const LoginRoute = () => {
  const isAuthenticated = useSelector((state) => state.api.authenticated);
  return isAuthenticated ? <Navigate to='/' replace /> : <OAuth />;
};

// Routes for the Cumulus Dashboard app
const App = () => {
  const [store] = useState(ourConfigureStore({}));

  return (
    // Router with Store
    <div className='routes'>
      <ErrorBoundary>
        <Provider store={store}>
          <BrowserRouter>
            <Routes>
              <Route path={'/login'} element={<Navigate to='/auth' replace />} />
              <Route path={'/auth'} element={<LoginRoute />} />
              <Route element={<AuthenicatedRoute />}>
                <Route path={'/'} index element={<Home />} />
                <Route path={'/collections'} element={<Collections />} />
                <Route path={'/granules'} element={<Granules />} />
                <Route path={'/pdrs'} element={<Pdrs />} />
                <Route path={'/providers'} element={<Providers />} />
                <Route path={'/workflows'} element={<Workflows />} />
                <Route path={'/executions'} element={<Executions />} />
                <Route path={'/operations'} element={<Operations />} />
                <Route path={'/rules'} element={<Rules />} />
                <Route path={'/reconciliation-reports'} element={<ReconciliationReports />}/>
              </Route>
              <Route path={'/404'} element={<NotFound />} />
              <Route path={'*'} element={<Navigate to='/404' replace />} />
              <Route path={'*'} element={<Navigate to='/' replace />} />
            </Routes>
          </BrowserRouter>
        </Provider>
      </ErrorBoundary>
    </div>
  );
};

export default App;
