'use strict';

import React from 'react';
import { withRouter, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import Sidebar from '../Sidebar/sidebar';
import DatePickerHeader from '../DatePickerHeader/DatePickerHeader';
import OperationOverview from './overview';
import { listOperations } from '../../actions';

class Operations extends React.Component {
  query () {
    this.props.dispatch(listOperations());
  }

  render () {
    return (
      <div className='page__workflows'>
        <div className='content__header'>
          <div className='row'>
            <ul className='datetimeheader'>
              <li>
                <div className='datetimeheader__content'>
                  <h1 className='heading--xlarge'>Operations</h1>
                </div>
              </li>
              <li>
                <DatePickerHeader onChange={this.query} />
              </li>
            </ul>
          </div>
        </div>
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
