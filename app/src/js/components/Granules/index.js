import React, { useEffect, lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { get } from 'object-path';
import { getCount, listGranules } from '../../actions';
import { strings } from '../locale';
import AllGranules from './list';
import GranuleOverview from './granule';
import GranulesOverview from './overview';
import CollectionOverview from '../Collections/overview';
// import ReconciliationReportList from '../ReconciliationReports/list';
import DatePickerHeader from '../DatePickerHeader/DatePickerHeader';
import Loading from '../LoadingIndicator/loading-indicator';
import { withUrlHelper } from '../../withUrlHelper';

const Sidebar = lazy(() => import('../Sidebar/sidebar'));

const Granules = ({ urlHelper }) => {
  const dispatch = useDispatch();
  const { queryParams, filterQueryParams, location } = urlHelper;
  const { pathname } = location;
  const filteredQueryParams = filterQueryParams(queryParams);

  const stats = useSelector((state) => state.stats);
  const granulesCount = get(stats, 'count.sidebar.granules.count') || [];
  /* const reportCount =
    get(stats, 'count.sidebar.reconciliationReports.count') || []; */ // The getCount for reports was removed previously
  const count = [...granulesCount];

  function query() {
    dispatch(listGranules(filteredQueryParams));
  }

  useEffect(() => {
    dispatch(
      getCount({
        type: 'granules',
        field: 'status',
        sidebarCount: true
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
              <Route index element={<Navigate to="all" replace />} />
              <Route path='all' element={<GranulesOverview queryParams={filteredQueryParams} stats={stats}/>} />
              <Route path='/granule/:granuleId' element={<GranuleOverview />} />
              <Route path='/collections/collection/:name/:version' element={<CollectionOverview />} />
              {/* <Route path='/lists' element={<ReconciliationReportList queryParams={filteredQueryParams} />} /> */}
              <Route path='/:status' element={<AllGranules queryParams={filteredQueryParams} stats={stats}/>} />
              <Route path='/running' element={<Navigate to='/granules/processing' />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

Granules.propTypes = {
  stats: PropTypes.object,
  urlHelper: PropTypes.shape({
    location: PropTypes.object,
    filterQueryParams: PropTypes.func,
    queryParams: PropTypes.object
  }),
};

export default withUrlHelper(Granules);
