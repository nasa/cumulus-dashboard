import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
// import withQueryParams from 'react-router-query-params';
import Sidebar from '../Sidebar/sidebar';
import WorkflowsOverview from './overview';
import Workflow from './workflow';
import { withUrlHelper } from '../../withUrlHelper';
// import { filterQueryParams } from '../../utils/url-helper';
// import withRouter from '../../withRouter';
// import useQueryParams from '../../useQueryParams';

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
              <Route
                exact
                path="/workflows"
                render={(props) => (
                  <WorkflowsOverview {...props} queryParams={filteredQueryParams} />
                )}
              ></Route>
              <Route
                path="/workflows/workflow/:workflowName"
                element={<Workflow />}
              ></Route>
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
