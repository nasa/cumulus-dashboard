'use strict';
import React from 'react';
import { Helmet } from 'react-helmet';
import { withRouter, Route, Switch } from 'react-router-dom';
import Sidebar from '../Sidebar/sidebar';
import PropTypes from 'prop-types';
import WorkflowsOverview from './overview';
import Workflow from './workflow';

class Workflows extends React.Component {
  render () {
    return (
      <div className='page__workflows'>
        <Helmet>
          <title> Cumulus Workflows </title>
        </Helmet>
        <div className='content__header'>
          <div className='row'>
            <h1 className='heading--xlarge'>Workflows</h1>
          </div>
        </div>
        <div className='page__content'>
          <div className='wrapper__sidebar'>
            <Sidebar
              currentPath={this.props.location.pathname}
              params={this.props.params}
            />
            <div className='page__content--shortened'>
              <Switch>
                <Route exact path='/workflows' component={WorkflowsOverview} />
                <Route path='/workflows/workflow/:workflowName' component={Workflow} />
              </Switch>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Workflows.propTypes = {
  children: PropTypes.object,
  location: PropTypes.object,
  params: PropTypes.object
};

export default withRouter(Workflows);
