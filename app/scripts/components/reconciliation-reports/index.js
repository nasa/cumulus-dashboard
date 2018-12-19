'use strict';
import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Sidebar from '../app/sidebar';
import LoadingEllipsis from '../app/loading-ellipsis';
import { interval, getCount, createReconciliationReport } from '../../actions';
import { updateInterval } from '../../config';

var ReconciliationReports = createReactClass({
  displayName: 'Reconciliation Reports',

  propTypes: {
    children: PropTypes.object,
    location: PropTypes.object,
    params: PropTypes.object,
    dispatch: PropTypes.func,
    stats: PropTypes.object,
    reconciliationReports: PropTypes.object
  },

  UNSAFE_componentWillMount: function () {
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
    const { reconciliationReports } = this.props;
    return (
      <div className='page__reconciliations'>
        <div className='content__header'>
          <div className='row'>
            <h1 className='heading--xlarge'>Reconciliation Reports</h1>
            <button className='button button--large button--white button__addcollections button__arrow button__animation' onClick={this.createReport}>
             { reconciliationReports.createReportInflight ? <LoadingEllipsis /> : 'Create a Report'}
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
  stats: state.stats,
  reconciliationReports: state.reconciliationReports
}))(ReconciliationReports);
