import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
// import withQueryParams from 'react-router-query-params';
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
// import { filterQueryParams } from '../../utils/url-helper';
import { withUrlHelper } from '../../withUrlHelper';

const Collections = ({ urlHelper }) => {
  const dispatch = useDispatch();
  const { queryParams, filterQueryParams, location } = urlHelper;
  const filteredQueryParams = filterQueryParams(queryParams);
  const { pathname } = location;
  const existingCollection = pathname !== '/collections/add';

  const logs = useSelector((state) => ({ logs: state.logs }));
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
          <Route path='/collections/all' element={<Sidebar />} />
          <Route path='/collections/edit/:name/:version' element={<Sidebar />} />
          <Route
            path='/collections/collection/:name/:version'
            element={<Sidebar />}
          />
          <div
            className={
              existingCollection ? 'page__content--shortened' : 'page__content'
            }
          >
            <Routes>
              <Route
                exact
                path='/collections'
                render={() => (
                  <Navigate
                    to={{
                      pathname: '/collections/all',
                      search: location.search,
                    }}
                  />
                )}
              ></Route>
              <Route
                path='/collections/all'
                render={(props) => (
                  <CollectionList
                    queryParams={filteredQueryParams}
                    {...props}
                  />
                )}
              ></Route>
              <Route path='/collections/add' element={<AddCollection />}></Route>
              <Route
                exact
                path='/collections/edit/:name/:version'
                element={<EditCollection />}
              ></Route>
              <Route
                exact
                path='/collections/collection/:name/:version'
                render={(props) => (
                  <CollectionOverview
                    queryParams={filteredQueryParams}
                    {...props}
                  />
                )}
              ></Route>
              <Route
                exact
                path='/collections/collection/:name/:version/granules'
                render={(props) => (
                  <CollectionGranules
                    queryParams={filteredQueryParams}
                    {...props}
                  />
                )}
              ></Route>
              <Route
                exact
                path='/collections/collection/:name/:version/granules/:status'
                render={(props) => (
                  <CollectionGranules
                    queryParams={filteredQueryParams}
                    {...props}
                  />
                )}
              ></Route>
              <Route
                exact
                path='/collections/collection/:name/:version/granules/running'
                render={() => (
                  <Navigate to='/collections/collection/:name/:version/granules/processing' />
                )}
              ></Route>
              <Route
                exact
                path='/collections/collection/:name/:version/definition'
                element={<CollectionIngest />}
              />
              {!metricsNotConfigured && (
                <Route
                  exact
                  path='/collections/collection/:name/:version/logs'
                  element={<CollectionLogs />}
                ></Route>
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
