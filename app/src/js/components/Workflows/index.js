import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { withRouter, Route, Switch } from 'react-router-dom';
import withQueryParams from 'react-router-query-params';
import Sidebar from '../Sidebar/sidebar';
import WorkflowsOverview from './overview';
import Workflow from './workflow';
import { filterQueryParams } from '../../utils/url-helper';

const Workflows = ({
  location,
  params,
  queryParams,
}) => {
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
            <Switch>
              <Route
                exact
                path="/workflows"
                render={(props) => (
                  <WorkflowsOverview {...props} queryParams={filteredQueryParams} />
                )}
              />
              <Route
                path="/workflows/workflow/:workflowName"
                component={Workflow}
              />
            </Switch>
          </div>
        </div>
      </div>
    </div>
  );
};

Workflows.propTypes = {
  location: PropTypes.object,
  params: PropTypes.object,
  queryParams: PropTypes.object,
};

export default withRouter(withQueryParams()(Workflows));
