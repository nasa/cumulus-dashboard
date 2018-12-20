'use strict';
import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import { get } from 'object-path';
import { connect } from 'react-redux';
import Sidebar from '../app/sidebar';
import { interval, getCount } from '../../actions';
import { updateInterval } from '../../config';

var Pdrs = createReactClass({
  displayName: 'Pdrs',

  propTypes: {
    children: PropTypes.object,
    location: PropTypes.object,
    params: PropTypes.object,
    dispatch: PropTypes.func,
    stats: PropTypes.object
  },

  UNSAFE_componentWillMount: function () {
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

export default connect(state => ({
  stats: state.stats
}))(Pdrs);
