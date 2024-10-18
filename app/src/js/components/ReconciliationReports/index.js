import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
// import withQueryParams from 'react-router-query-params';
import Sidebar from '../Sidebar/sidebar';
import { strings } from '../locale';
import { getCount, listReconciliationReports } from '../../actions';
import CreateReconciliationReport from './create';
import ReconciliationReportList from './list';
import ReconciliationReport from './reconciliation-report';
import BackupReportGranuleDetails from './backup-report-granule-details';
import DatePickerHeader from '../DatePickerHeader/DatePickerHeader';
// import { filterQueryParams } from '../../utils/url-helper';
import { withUrlHelper } from '../../withUrlHelper';

const ReconciliationReports = ({ urlHelper }) => {
  const dispatch = useDispatch();
  const { queryParams, filterQueryParams, location, params } = urlHelper;
  const filteredQueryParams = filterQueryParams(queryParams);
  const { pathname } = location;
  const showSidebar = pathname !== '/reconciliation-reports/create';

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
            <Routes>
              <Route exact path='/reconciliation-reports' render={(props) => <ReconciliationReportList queryParams={filteredQueryParams} {...props} />}></Route>
              <Route path="/reconciliation-reports/create" element={<CreateReconciliationReport />}></Route>
              <Route path='/reconciliation-reports/report/:reconciliationReportName/details' element={<BackupReportGranuleDetails />}></Route>
              <Route path='/reconciliation-reports/report/:reconciliationReportName' element={<ReconciliationReport />}></Route>
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

ReconciliationReports.propTypes = {
  urlHelper: PropTypes.shape({
    location: PropTypes.object,
    filterQueryParams: PropTypes.func,
    params: PropTypes.object,
    queryParams: PropTypes.object
  }),
};

ReconciliationReports.displayName = 'Reconciliation Reports';

export default withUrlHelper(ReconciliationReports);
