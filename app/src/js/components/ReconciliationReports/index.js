'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Sidebar from '../Sidebar/sidebar';
import LoadingEllipsis from '../LoadingEllipsis/loading-ellipsis';
import { interval, getCount, createReconciliationReport } from '../../actions';
import _config from '../../config';

const { updateInterval } = _config;

class ReconciliationReports extends React.Component {
  constructor () {
    super();
    this.displayName = 'Reconciliation Reports';
    this.query = this.query.bind(this);
    this.createReport = this.createReport.bind(this);
  }

  componentDidMount () {
    this.cancelInterval = interval(() => this.query(), updateInterval, true);
  }

  componentWillUnmount () {
    if (this.cancelInterval) { this.cancelInterval(); }
  }

  query () {
    this.props.dispatch(getCount({
      type: 'reconciliationReports',
      field: 'status'
    }));
  }

  createReport () {
    this.props.dispatch(createReconciliationReport());
  }

  render () {
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
          <div className='wrapper__sidebar'>
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
}

ReconciliationReports.propTypes = {
  children: PropTypes.object,
  location: PropTypes.object,
  params: PropTypes.object,
  dispatch: PropTypes.func,
  stats: PropTypes.object,
  reconciliationReports: PropTypes.object
};

export default withRouter(connect(state => ({
  stats: state.stats,
  reconciliationReports: state.reconciliationReports
}))(ReconciliationReports));
