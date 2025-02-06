import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import Sidebar from '../Sidebar/sidebar';
import { strings } from '../locale';
import { getCount, listReconciliationReports } from '../../actions';
import CreateReconciliationReport from './create';
import ReconciliationReportList from './list';
import ReconciliationReport from './reconciliation-report';
import BackupReportGranuleDetails from './backup-report-granule-details';
import DatePickerHeader from '../DatePickerHeader/DatePickerHeader';
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
              <Route index element={<Navigate to="all" replace />} />
              <Route path='all' element={<ReconciliationReportList queryParams={filteredQueryParams} />} />
              <Route path="/create" element={<CreateReconciliationReport />} />
              <Route path='/report/:reconciliationReportName/details' element={<BackupReportGranuleDetails />} />
              <Route path='/report/:reconciliationReportName' element={<ReconciliationReport />} />
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
