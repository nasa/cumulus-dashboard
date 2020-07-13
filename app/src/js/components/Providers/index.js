'use strict';
import React from 'react';
import { Helmet } from 'react-helmet';
import { withRouter, Route, Switch } from 'react-router-dom';
import withQueryParams from 'react-router-query-params';
import Sidebar from '../Sidebar/sidebar';
import PropTypes from 'prop-types';
import AddProvider from './add';
import EditProvider from './edit';
import ProvidersOverview from './overview';
import ProviderOverview from './provider';

const Providers = ({
  location,
  params,
  queryParams,
}) => {
  const { pathname } = location;
  const showSidebar = pathname !== '/providers/add';
  return (
    <div className="page__providers">
      <Helmet>
        <title> Cumulus Providers </title>
      </Helmet>
      <div className="content__header">
        <div className="row">
          <h1 className="heading--xlarge heading--shared-content">Providers</h1>
        </div>
      </div>
      <div className="page__content">
        <div className="wrapper__sidebar">
          {showSidebar && <Sidebar currentPath={pathname} params={params} />}
          <div
            className={
              showSidebar ? 'page__content--shortened' : 'page__content'
            }
          >
            <Switch>
              <Route
                exact
                path="/providers"
                render={(props) => (
                  <ProvidersOverview {...props} queryParams={queryParams} />
                )}
              />
              <Route path="/providers/add" component={AddProvider} />
              <Route
                path="/providers/edit/:providerId"
                component={EditProvider}
              />
              <Route
                path="/providers/provider/:providerId"
                component={ProviderOverview}
              />
            </Switch>
          </div>
        </div>
      </div>
    </div>
  );
};

Providers.propTypes = {
  location: PropTypes.object,
  params: PropTypes.object,
  queryParams: PropTypes.object,
};

export default withRouter(withQueryParams()(Providers));
