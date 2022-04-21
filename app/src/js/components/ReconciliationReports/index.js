import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Route, Switch } from 'react-router-dom';
import withQueryParams from 'react-router-query-params';
import Sidebar from '../Sidebar/sidebar';
import { strings } from '../locale';
import { getCount, listReconciliationReports } from '../../actions';
import CreateReconciliationReport from './create';
import ReconciliationReportList from './list';
import ReconciliationReport from './reconciliation-report';
import BackupReportGranuleDetails from './backup-report-granule-details';
import DatePickerHeader from '../DatePickerHeader/DatePickerHeader';
import { filterQueryParams } from '../../utils/url-helper';

const ReconciliationReports = ({
  dispatch,
  location,
  params,
  queryParams,
}) => {
  const { pathname } = location;
  const showSidebar = pathname !== '/reconciliation-reports/create';
  const filteredQueryParams = filterQueryParams(queryParams);

  function query() {
    dispatch(listReconciliationReports(filteredQueryParams));
    dispatch(getCount({
      type: 'reconciliationReports',
      field: 'status',
      ...filteredQueryParams
    }));
  }

  return (
    <div className='page__reconciliations'>
      <Helmet>
        <title> Reconcilation Reports </title>
      </Helmet>
      <DatePickerHeader onChange={query} heading={strings.reconciliation_reports} showDatePicker={showSidebar} />

      <div className='page__content'>
        <div className="wrapper__sidebar">
          {showSidebar && <Sidebar currentPath={pathname} params={params} />}
          <div
            className={
              showSidebar ? 'page__content--shortened' : 'page__content'
            }
          >
            <Switch>
              <Route exact path='/reconciliation-reports' render={(props) => <ReconciliationReportList queryParams={filteredQueryParams} {...props} />} />
              <Route path="/reconciliation-reports/create" component={CreateReconciliationReport} />
              <Route path='/reconciliation-reports/report/:reconciliationReportName/details' component={BackupReportGranuleDetails} />
              <Route path='/reconciliation-reports/report/:reconciliationReportName' component={ReconciliationReport} />
            </Switch>
          </div>
        </div>
      </div>
    </div>
  );
};

ReconciliationReports.propTypes = {
  dispatch: PropTypes.func,
  location: PropTypes.object,
  params: PropTypes.object,
  queryParams: PropTypes.object,
};

ReconciliationReports.displayName = 'Reconciliation Reports';

export default withRouter(withQueryParams()(connect()(ReconciliationReports)));
