import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import Sidebar from '../Sidebar/sidebar';
import WorkflowsOverview from './overview';
import Workflow from './workflow';
import { withUrlHelper } from '../../withUrlHelper';

const Workflows = ({ urlHelper }) => {
  const { queryParams, filterQueryParams, location, params } = urlHelper;
  const filteredQueryParams = filterQueryParams(queryParams);

  return (
    <div className="page__workflows">
      <Helmet>
        <title> Cumulus Workflows </title>
      </Helmet>
      <div className="content__header">
        <div className="row">
          <h1 className="heading--xlarge">Workflows</h1>
        </div>
      </div>
      <div className="page__content">
        <div className="wrapper__sidebar">
          <Sidebar currentPath={location.pathname} params={params} />
          <div className="page__content--shortened">
            <Routes>
            <Route index element={<Navigate to="all" replace />} />
              <Route
                exact
                path="all"
                element={<WorkflowsOverview queryParams={filteredQueryParams} />}
              />
              <Route
                path="/workflow/:workflowName"
                element={<Workflow />}
              />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

Workflows.propTypes = {
  urlHelper: PropTypes.shape({
    location: PropTypes.object,
    filterQueryParams: PropTypes.func,
    params: PropTypes.object,
    queryParams: PropTypes.object
  }),
};

export default withUrlHelper(Workflows);
