import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import Sidebar from '../Sidebar/sidebar';
import AddProvider from './add';
import EditProvider from './edit';
import ProvidersOverview from './overview';
import ProviderOverview from './provider';
import { withUrlHelper } from '../../withUrlHelper';

const Providers = ({ urlHelper }) => {
  const { queryParams, filterQueryParams, location, params } = urlHelper;
  const { pathname } = location;
  const showSidebar = pathname !== '/providers/add';
  const filteredQueryParams = filterQueryParams(queryParams);

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
            <Routes>
            <Route index element={<Navigate to="all" replace />} />
              <Route
                path="all"
                element={<ProvidersOverview queryParams={filteredQueryParams} />}
              />
              <Route path="add" element={<AddProvider />} />
              <Route
                path="edit/:providerId"
                element={<EditProvider />}
              />
              <Route
                path="provider/:providerId"
                element={<ProviderOverview />}
              />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

Providers.propTypes = {
  urlHelper: PropTypes.shape({
    location: PropTypes.object,
    filterQueryParams: PropTypes.func,
    params: PropTypes.object,
    queryParams: PropTypes.object
  }),
};

export default withUrlHelper(Providers);
