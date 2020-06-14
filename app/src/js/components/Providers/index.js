'use strict';
import React from 'react';
import { Helmet } from 'react-helmet';
import { withRouter, Route, Switch } from 'react-router-dom';
import Sidebar from '../Sidebar/sidebar';
import PropTypes from 'prop-types';
import AddProvider from './add';
import EditProvider from './edit';
import ProvidersOverview from './overview';
import ProviderOverview from './provider';

class Providers extends React.Component {
  constructor () {
    super();
    this.displayName = 'Providers';
  }

  render () {
    const { pathname } = this.props.location;
    const showSidebar = pathname !== '/providers/add';
    return (
      <div className='page__providers'>
        <Helmet>
          <title> Cumulus Providers </title>
        </Helmet>
        <div className='content__header'>
          <div className='row'>
            <h1 className='heading--xlarge heading--shared-content'>Providers</h1>
          </div>
        </div>
        <div className='page__content'>
          <div className='wrapper__sidebar'>
            {showSidebar ? <Sidebar
              currentPath={this.props.location.pathname}
              params={this.props.params}
            /> : null}
            <div className={showSidebar ? 'page__content--shortened' : 'page__content'}>
              <Switch>
                <Route exact path='/providers' component={ProvidersOverview} />
                <Route path='/providers/add' component={AddProvider} />
                <Route path='/providers/edit/:providerId' component={EditProvider} />
                <Route path='/providers/provider/:providerId' component={ProviderOverview} />
              </Switch>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Providers.propTypes = {
  children: PropTypes.object,
  location: PropTypes.object,
  params: PropTypes.object
};

export default withRouter(Providers);
