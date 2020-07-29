'use strict';
import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Redirect, Route, Switch } from 'react-router-dom';
import withQueryParams from 'react-router-query-params';
import Sidebar from '../Sidebar/sidebar';
import { strings } from '../locale';
import CollectionList from '../../components/Collections/list';
import AddCollection from '../../components/Collections/add';
import EditCollection from '../../components/Collections/edit';
import CollectionOverview from '../../components/Collections/overview';
import CollectionGranules from '../../components/Collections/granules';
import CollectionIngest from '../../components/Collections/ingest';
import CollectionLogs from '../../components/Collections/logs';
import DatePickerHeader from '../../components/DatePickerHeader/DatePickerHeader';
import { listCollections } from '../../actions';
import { filterQueryParams } from '../../utils/url-helper';

const Collections = ({ dispatch, location, queryParams }) => {
  const { pathname } = location;
  const existingCollection = pathname !== '/collections/add';
  const filteredQueryParams = filterQueryParams(queryParams);

  function query() {
    dispatch(listCollections(filteredQueryParams));
  }

  return (
    <div className="page__collections">
      <DatePickerHeader onChange={query} heading={strings.collections} />
      <div className="page__content">
        <Helmet>
          <title> Cumulus Collections </title>
        </Helmet>
        <div className="wrapper__sidebar">
          <Route path="/collections/all" component={Sidebar} />
          <Route path="/collections/edit/:name/:version" component={Sidebar} />
          <Route
            path="/collections/collection/:name/:version"
            component={Sidebar}
          />
          <div
            className={
              existingCollection ? 'page__content--shortened' : 'page__content'
            }
          >
            <Switch>
              <Redirect
                exact
                from="/collections"
                to={{
                  pathname: '/collections/all',
                  search: location.search,
                }}
              />
              <Route
                path="/collections/all"
                render={(props) => (
                  <CollectionList
                    queryParams={filteredQueryParams}
                    {...props}
                  />
                )}
              />
              <Route path="/collections/add" component={AddCollection} />
              <Route
                exact
                path="/collections/edit/:name/:version"
                component={EditCollection}
              />
              <Route
                exact
                path="/collections/collection/:name/:version"
                render={(props) => (
                  <CollectionOverview
                    queryParams={filteredQueryParams}
                    {...props}
                  />
                )}
              />
              <Route
                exact
                path="/collections/collection/:name/:version/granules"
                render={(props) => (
                  <CollectionGranules
                    queryParams={filteredQueryParams}
                    {...props}
                  />
                )}
              />
              <Route
                exact
                path="/collections/collection/:name/:version/granules/completed"
                render={(props) => (
                  <CollectionGranules
                    queryParams={filteredQueryParams}
                    {...props}
                  />
                )}
              />
              <Route
                exact
                path="/collections/collection/:name/:version/granules/processing"
                render={(props) => (
                  <CollectionGranules
                    queryParams={filteredQueryParams}
                    {...props}
                  />
                )}
              />
              <Route
                exact
                path="/collections/collection/:name/:version/granules/failed"
                render={(props) => (
                  <CollectionGranules
                    queryParams={filteredQueryParams}
                    {...props}
                  />
                )}
              />
              <Redirect
                exact
                from="/collections/collection/:name/:version/granules/running"
                to="/collections/collection/:name/:version/granules/processing"
              />
              <Route
                exact
                path="/collections/collection/:name/:version/definition"
                component={CollectionIngest}
              />
              <Route
                exact
                path="/collections/collection/:name/:version/logs"
                component={CollectionLogs}
              />
            </Switch>
          </div>
        </div>
      </div>
    </div>
  );
};

Collections.displayName = strings.collection;

Collections.propTypes = {
  dispatch: PropTypes.func,
  location: PropTypes.object,
  queryParams: PropTypes.object,
};

export default withRouter(withQueryParams()(connect()(Collections)));
