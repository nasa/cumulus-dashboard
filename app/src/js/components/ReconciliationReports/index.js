'use strict';
import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Route, Switch } from 'react-router-dom';
import Sidebar from '../Sidebar/sidebar';
import { strings } from '../locale';
import { getCount, listReconciliationReports } from '../../actions';
import ReconciliationReportList from './list';
import ReconciliationReport from './reconciliation-report';
import DatePickerHeader from '../../components/DatePickerHeader/DatePickerHeader';
import Legend from './legend';

class ReconciliationReports extends React.Component {
  query() {
    this.props.dispatch(listReconciliationReports());
    this.props.dispatch(getCount({
      type: 'reconciliationReports',
      field: 'status'
    }));
  }

  render () {
    return (
      <div className='page__reconciliations'>
        <Helmet>
          <title> Reconcilation Reports </title>
        </Helmet>
        <DatePickerHeader onChange={this.query} heading={strings.reconciliation_reports} />
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
              <section className='page__section'>
                <Legend />
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ReconciliationReports.propTypes = {
  location: PropTypes.object,
  params: PropTypes.object,
  dispatch: PropTypes.func,
};

ReconciliationReports.displayName = 'Reconciliation Reports';

export default withRouter(connect()(ReconciliationReports));
