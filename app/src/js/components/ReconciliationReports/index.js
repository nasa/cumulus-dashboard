'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Route, Switch } from 'react-router-dom';
import Sidebar from '../Sidebar/sidebar';
import { interval, getCount } from '../../actions';
import _config from '../../config';
import ReconciliationReportList from './list';
import ReconciliationReport from './reconciliation-report';
import withQueryParams from 'react-router-query-params';

const { updateInterval } = _config;

class ReconciliationReports extends React.Component {
  constructor () {
    super();
    this.displayName = 'Reconciliation Reports';
    this.queryParams = this.queryParams.bind(this);
  }

  componentDidMount () {
    this.cancelInterval = interval(() => this.queryParams(), updateInterval, true);
  }

  componentWillUnmount () {
    if (this.cancelInterval) { this.cancelInterval(); }
  }

  queryParams () {
    this.props.dispatch(getCount({
      type: 'reconciliationReports',
      field: 'status'
    }));
  }

  render () {
    return (
      <div className='page__reconciliations'>
        <div className='content__header'>
          <div className='row'>
            <h1 className='heading--xlarge heading--shared-content'>Reconciliation Reports</h1>
          </div>
        </div>
        <div className='page__content'>
          <div className='wrapper__sidebar'>
            <Sidebar
              currentPath={this.props.location.pathname}
              params={this.props.params}
            />
            <div className='page__content--shortened'>
              <Switch>
                <Route exact path='/reconciliation-reports' component={ReconciliationReportList} />
                <Route path='/reconciliation-reports/report/:reconciliationReportName' component={ReconciliationReport} />
              </Switch>
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
  reconciliationReports: PropTypes.object,
  queryParams: PropTypes.object
};

export default withRouter(withQueryParams()(connect(state => ({
  stats: state.stats,
  reconciliationReports: state.reconciliationReports
}))(ReconciliationReports)));
