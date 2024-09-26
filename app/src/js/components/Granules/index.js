import React, { useEffect, lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { get } from 'object-path';
import { connect } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import withQueryParams from 'react-router-query-params';
import { getCount, listGranules } from '../../actions';
import { strings } from '../locale';
import AllGranules from './list';
import GranuleOverview from './granule';
import GranulesOverview from './overview';
import ReconciliationReportList from '../ReconciliationReports/list';
import DatePickerHeader from '../DatePickerHeader/DatePickerHeader';
import { filterQueryParams } from '../../utils/url-helper';
import Loading from '../LoadingIndicator/loading-indicator';
import withRouter from '../../withRouter';

const Sidebar = lazy(() => import('../Sidebar/sidebar'));

const Granules = ({ dispatch, location, queryParams, stats }) => {
  const { pathname } = location;
  const granulesCount = get(stats, 'count.sidebar.granules.count') || [];
  const reportCount =
    get(stats, 'count.sidebar.reconciliationReports.count') || [];
  const count = [...granulesCount, ...reportCount];
  const filteredQueryParams = filterQueryParams(queryParams);

  function query() {
    dispatch(listGranules(filteredQueryParams));
  }

  useEffect(() => {
    dispatch(
      getCount({
        type: 'granules',
        field: 'status',
        sidebarCount: true,
      })
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      getCount({
        type: 'reconciliationReports',
        field: 'type',
        sidebarCount: true,
      })
    );
  }, [dispatch]);

  return (
    <div className='page__granules'>
      <Helmet>
        <title> Granules </title>
      </Helmet>
      <DatePickerHeader onChange={query} heading={strings.granules} />
      <div className='page__content'>
        <div className='wrapper__sidebar'>
          <Suspense fallback={<Loading />}>
            <Sidebar currentPath={pathname} count={count} location={location} />
          </Suspense>
          <div className='page__content--shortened'>
            <Routes>
              <Route
                exact
                path='/granules'
                render={(props) => (
                  <GranulesOverview
                    queryParams={filteredQueryParams}
                    {...props}
                  />
                )}
              ></Route>
              <Route
                path='/granules/granule/:granuleId'
                element={<GranuleOverview />}
              ></Route>
              <Route
                path='/granules/lists'
                render={(props) => (
                  <ReconciliationReportList
                    queryParams={filteredQueryParams}
                    {...props}
                  />
                )}
              ></Route>
              <Route
                path='/granules/:status'
                render={(props) => (
                  <AllGranules queryParams={filteredQueryParams} {...props} />
                )}
              ></Route>
              <Route
                exact
                path='/granules/running'
                render={() => <Navigate to='/granules/processing' />}
              ></Route>
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

Granules.propTypes = {
  location: PropTypes.object,
  dispatch: PropTypes.func,
  queryParams: PropTypes.object,
  stats: PropTypes.object,
};

export default withRouter(
  withQueryParams()(
    connect((state) => ({
      stats: state.stats,
    }))(Granules)
  )
);
