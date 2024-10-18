import React, { useEffect, lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { get } from 'object-path';
// import withQueryParams from 'react-router-query-params';
import { getCount, listGranules } from '../../actions';
import { strings } from '../locale';
import AllGranules from './list';
import GranuleOverview from './granule';
import GranulesOverview from './overview';
import ReconciliationReportList from '../ReconciliationReports/list';
import DatePickerHeader from '../DatePickerHeader/DatePickerHeader';
// import { filterQueryParams } from '../../utils/url-helper';
import Loading from '../LoadingIndicator/loading-indicator';
import { withUrlHelper } from '../../withUrlHelper';

const Sidebar = lazy(() => import('../Sidebar/sidebar'));

const Granules = ({ urlHelper }) => {
  const dispatch = useDispatch();
  const { queryParams, filterQueryParams, location } = urlHelper;
  const filteredQueryParams = filterQueryParams(queryParams);
  const { pathname } = location;

  const stats = useSelector((state) => ({ stats: state.stats })); // sidebar routing state for granule count

  const granulesCount = get(stats, 'count.sidebar.granules.count') || [];
  const reportCount =
    get(stats, 'count.sidebar.reconciliationReports.count') || [];
  const count = [...granulesCount, ...reportCount];

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
  urlHelper: PropTypes.shape({
    location: PropTypes.object,
    filterQueryParams: PropTypes.func,
    queryParams: PropTypes.object
  }),
};

export default withUrlHelper(Granules);
