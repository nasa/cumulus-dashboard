'use strict';
import React from 'react';
import { get } from 'object-path';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Sidebar from '../app/sidebar';
import { interval, getAggregate } from '../../actions';
import { updateInterval } from '../../config';

var Providers = React.createClass({
  displayName: 'Providers',

  propTypes: {
    children: React.PropTypes.object,
    location: React.PropTypes.object,
    params: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    stats: React.PropTypes.object
  },

  componentWillMount: function () {
    this.cancelInterval = interval(() => this.query(), updateInterval, true);
  },

  componentWillUnmount: function () {
    if (this.cancelInterval) { this.cancelInterval(); }
  },

  query: function () {
    this.props.dispatch(getAggregate({
      type: 'providers',
      field: 'status'
    }));
  },

  render: function () {
    const { pathname } = this.props.location;
    const alreadyInAddProvider = pathname === '/providers/add';
    const count = get(this.props.stats, 'count.data.providers.count');
    return (
      <div className='page__providers'>
        <div className='content__header'>
          <div className='row'>
            <h1 className='heading--xlarge heading--shared-content'>Providers</h1>
            {alreadyInAddProvider ? null : <Link className='button button--large button--white button__addcollections button__arrow button__animation' to='/providers/add'>Add a Provider</Link>}
          </div>
        </div>
        <div className='page__content'>
          <div className='row wrapper__sidebar'>
            {alreadyInAddProvider ? null : <Sidebar
              currentPath={this.props.location.pathname}
              params={this.props.params}
              count={count}
            />}
            <div className='page__content--shortened'>
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    );
  }
});

export default connect(state => state)(Providers);
