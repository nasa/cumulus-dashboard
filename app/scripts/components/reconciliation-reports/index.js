'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Sidebar from '../app/sidebar';
import { interval, getCount, createReconciliationReport } from '../../actions';
import { updateInterval } from '../../config';

var ReconciliationReports = React.createClass({
  displayName: 'Reconciliation Reports',

  propTypes: {
    children: PropTypes.object,
    location: PropTypes.object,
    params: PropTypes.object,
    dispatch: PropTypes.func,
    stats: PropTypes.object
  },

  componentWillMount: function () {
    this.cancelInterval = interval(() => this.query(), updateInterval, true);
  },

  componentWillUnmount: function () {
    if (this.cancelInterval) { this.cancelInterval(); }
  },

  query: function () {
    this.props.dispatch(getCount({
      type: 'reconciliationReports',
      field: 'status'
    }));
  },

  createReport: function () {
    this.props.dispatch(createReconciliationReport());
  },

  render: function () {
    return (
      <div className='page__reconciliations'>
        <div className='content__header'>
          <div className='row'>
            <h1 className='heading--xlarge'>Reconciliations</h1>
            <button className='button button--large button--white button__addcollections button__arrow button__animation' onClick={this.createReport}>
              Create a Report
            </button>
          </div>
        </div>
        <div className='page__content'>
          <div className='row wrapper__sidebar'>
            <Sidebar
              currentPath={this.props.location.pathname}
              params={this.props.params}
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
}))(ReconciliationReports);
