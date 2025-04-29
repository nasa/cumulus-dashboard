import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import Sidebar from '../Sidebar/sidebar';
import { strings } from '../locale';
import CollectionList from './list';
import AddCollection from './add';
import EditCollection from './edit';
import CollectionOverview from './overview';
import CollectionGranules from './granules';
import CollectionIngest from './ingest';
import CollectionLogs from './logs';
import DatePickerHeader from '../DatePickerHeader/DatePickerHeader';
import { listCollections } from '../../actions';
import { withUrlHelper } from '../../withUrlHelper';

const Collections = ({ urlHelper }) => {
  const dispatch = useDispatch();
  const { queryParams, filterQueryParams, location } = urlHelper;
  const filteredQueryParams = filterQueryParams(queryParams);
  const { pathname } = location;
  const existingCollection = pathname !== '/collections/add';
  const logs = useSelector((state) => state.logs);
  const { metricsNotConfigured } = logs;

  function query() {
    dispatch(listCollections(filteredQueryParams));
  }

  useEffect(() => {
    dispatch(listCollections(filteredQueryParams));
  }, [dispatch, filteredQueryParams]);

  return (
    <div className='page__collections'>
      <DatePickerHeader onChange={query} heading={strings.collections} />
      <div className='page__content'>
        <Helmet>
          <title> Cumulus Collections </title>
        </Helmet>
        <div className='wrapper__sidebar'>
          <Routes>
            <Route path='all' element={<Sidebar />} />
            <Route path='edit/:name/:version' element={<Sidebar />} />
            <Route path='collection/:name/:version/*' element={<Sidebar />} />
          </Routes>
          <div
            className={
              existingCollection ? 'page__content--shortened' : 'page__content'
            }
          >
            <Routes>
              <Route index element={<Navigate to='all' replace />} />
              <Route path='all' element={<CollectionList queryParams={filteredQueryParams} />} />
              <Route path='add' element={<AddCollection />} />
              <Route path='edit/:name/:version' element={<EditCollection />} />
              <Route path='collection/:name/:version' element={<CollectionOverview queryParams={filteredQueryParams} />} />
              <Route path='collection/:name/:version/granules' element={<CollectionGranules queryParams={filteredQueryParams} />} />
              <Route path='collection/:name/:version/granules/:status' element={<CollectionGranules queryParams={filteredQueryParams} />} />
              <Route path='granules/running' element={<Navigate to='processing' replace/>} />
              <Route path='collection/:name/:version/definition' element={<CollectionIngest />} />
              {!metricsNotConfigured && (
                <Route path='collection/:name/:version/logs' element={<CollectionLogs />} />
              )}
          </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

Collections.displayName = strings.collection;

Collections.propTypes = {
  urlHelper: PropTypes.shape({
    location: PropTypes.object,
    filterQueryParams: PropTypes.func,
    queryParams: PropTypes.object
  }),
};

export default withUrlHelper(Collections);
