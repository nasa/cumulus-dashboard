import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Outlet } from 'react-router-dom';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import _config from './config';
import { displayCase } from './utils/format';
import Header from './components/Header/header';
import Footer from './components/Footer/footer';
import TopButton from './components/TopButton/TopButton';
import { getLogs } from './actions';
import { initialState as logsInitialState } from './reducers/logs';
import { withUrlHelper } from './withUrlHelper';

const { target, environment } = _config;

const Main = ({
  api,
  apiVersion,
  cmrInfo,
  cumulusInstance,
  dispatch,
  logs,
  urlHelper
}) => {
  const { location } = urlHelper;
  useEffect(() => {
    // kick off an initial logs request to check if metrics is configured
    if (isEqual(logs, logsInitialState)) {
      dispatch(getLogs());
    }
  }, [dispatch, logs]);

  return (
    <div className='app'>
      {target !== 'cumulus' && (
        <div className='app__target--container' role='region'>
          <h4 className='app__target'>{displayCase(target)} ({displayCase(environment)})</h4>
        </div>
      )}
      <Header
        dispatch={dispatch}
        api={api}
        location={location}
        cumulusInstance={cumulusInstance}
      />
      <main className='main' role='main'>
        <Outlet />
      </main>
      <section className='page__section--top'>
        <TopButton />
      </section>
      <Footer api={api} apiVersion={apiVersion} cmrInfo={cmrInfo} />
    </div>
  );
};

Main.propTypes = {
  dispatch: PropTypes.func,
  api: PropTypes.object,
  apiVersion: PropTypes.object,
  cmrInfo: PropTypes.object,
  cumulusInstance: PropTypes.object,
  logs: PropTypes.object,
  urlHelper: PropTypes.shape({
    location: PropTypes.object,
  }),
};

export { Main };

export default withUrlHelper(connect((state) => state)(Main));
