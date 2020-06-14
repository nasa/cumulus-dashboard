'use strict';

import React from 'react';
import { withRouter, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import Sidebar from '../Sidebar/sidebar';
import DatePickerHeader from '../DatePickerHeader/DatePickerHeader';
import OperationOverview from './overview';
import { listOperations } from '../../actions';
import { strings } from '../locale';

class Operations extends React.Component {
  query () {
    this.props.dispatch(listOperations());
    this.displayName = strings.operations;
  }

  render () {
    return (
      <div className='page__workflows'>
        <Helmet>
          <title> Cumulus Operations </title>
        </Helmet>
        <DatePickerHeader onChange={this.query} heading={strings.operations}/>
        <div className='page__content'>
          <div className='wrapper__sidebar'>
            <Sidebar
              currentPath={this.props.location.pathname}
              params={this.props.params}
            />
            <div className='page__content--shortened'>
              <Route exact path='/operations' component={OperationOverview} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Operations.propTypes = {
  children: PropTypes.object,
  dispatch: PropTypes.func,
  location: PropTypes.object,
  params: PropTypes.object
};

export default withRouter(Operations);
