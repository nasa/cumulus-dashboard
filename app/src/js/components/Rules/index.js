'use strict';
import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { withRouter, Route, Switch } from 'react-router-dom';
import Sidebar from '../Sidebar/sidebar';
import RulesOverview from './overview';
import Rule from './rule';
import EditRule from './edit';
import AddRule from './add';

class Rules extends React.Component {
  render () {
    const { pathname } = this.props.location;
    const showSidebar = pathname !== '/rules/add';
    return (
      <div className='page__rules'>
        <Helmet>
          <title> Rules Overview </title>
        </Helmet>
        <div className='content__header'>
          <div className='row'>
            <h1 className='heading--xlarge heading--shared-content'>Rules</h1>
          </div>
        </div>
        <div className='page__content'>
          <div className='wrapper__sidebar'>
            {showSidebar ? (
              <Sidebar
                currentPath={this.props.location.pathname}
                params={this.props.params}
              />
            ) : null}
            <div className={showSidebar ? 'page__content--shortened' : 'page__content'}>
              <Switch>
                <Route exact path='/rules' component={RulesOverview} />
                <Route path='/rules/rule/:ruleName' component={Rule} />
                <Route path='/rules/edit/:ruleName' component={EditRule} />
                <Route path='/rules/add' component={AddRule} />
              </Switch>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Rules.propTypes = {
  children: PropTypes.object,
  location: PropTypes.object,
  params: PropTypes.object
};

export default withRouter(Rules);
