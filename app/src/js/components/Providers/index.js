import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Helmet } from 'react-helmet';
// import withQueryParams from 'react-router-query-params';
import PropTypes from 'prop-types';
import Sidebar from '../Sidebar/sidebar';
import AddProvider from './add';
import EditProvider from './edit';
import ProvidersOverview from './overview';
import ProviderOverview from './provider';
// import { filterQueryParams } from '../../utils/url-helper';
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
              <Route
                exact
                path="/providers"
                render={(props) => (
                  <ProvidersOverview {...props} queryParams={filteredQueryParams} />
                )}
              />
              <Route path="/providers/add" element={<AddProvider />} />
              <Route
                path="/providers/edit/:providerId"
                element={<EditProvider />}
              />
              <Route
                path="/providers/provider/:providerId"
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
