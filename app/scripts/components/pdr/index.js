'use strict';
import React from 'react';
import { get } from 'object-path';
import { connect } from 'react-redux';
import Sidebar from '../app/sidebar';
import { interval, getCount } from '../../actions';
import { updateInterval } from '../../config';

var Pdrs = React.createClass({
  displayName: 'Pdrs',

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
    this.props.dispatch(getCount({
      type: 'pdrs',
      field: 'status'
    }));
  },

  render: function () {
    const count = get(this.props.stats, 'count.data.pdrs.count');
    return (
      <div className='page__pdrs'>
        <div className='content__header'>
          <div className='row'>
            <h1 className='heading--xlarge'>PDRs</h1>
          </div>
        </div>
        <div className='page__content'>
          <div className='row wrapper__sidebar'>
            <Sidebar
              currentPath={this.props.location.pathname}
              params={this.props.params}
              count={count}
            />
            <div className='page__content--shortened'>
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    );
  }
});

export default connect(state => state)(Pdrs);
