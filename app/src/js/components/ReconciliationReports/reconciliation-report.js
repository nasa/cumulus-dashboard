import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import get from 'lodash/get';
import {
  getReconciliationReport,
  listWorkflows,
} from '../../actions';
import Loading from '../LoadingIndicator/loading-indicator';
import InventoryReport from './inventory-report';
import GnfReport from './gnf-report';
import Legend from './legend';
import BackupReport from './backup-report';

const ReconciliationReport = ({
  dispatch = {},
  match,
  reconciliationReports = [],
}) => {
  const { reconciliationReportName: encodedReportName } = match.params;
  const reconciliationReportName = decodeURIComponent(encodedReportName);
  const { list, map, searchString: filterString } = reconciliationReports;
  const record = map[reconciliationReportName];

  let error = get(record, 'data.error');
  let reportData = get(record, 'data.data', {});
  const reportUrl = get(record, 'data.presignedS3Url');

  // report data is an error message
  if (typeof reportData === 'string' && reportData.startsWith('Error')) {
    const reportError = `${reportData}, please download the report instead`;
    error = error || reportError;
    reportData = {};
  }

  const recordData = { ...reportData, error };
  const { reportType = 'Inventory' } = recordData || {};
  const filterBucket = list.params.bucket;

  useEffect(() => {
    dispatch(getReconciliationReport(reconciliationReportName));
  }, [dispatch, reconciliationReportName]);

  useEffect(() => {
    dispatch(listWorkflows());
  }, [dispatch]);

  if (!record || (record.inflight && !record.data)) {
    return <Loading />;
  }

  return (
    <>
      {
        {
          Inventory: <InventoryReport
            filterBucket={filterBucket}
            filterString={filterString}
            legend={<Legend />}
            recordData={recordData}
            reportName={reconciliationReportName}
            reportUrl={reportUrl}
          />,
          'Granule Not Found': <GnfReport
            filterString={filterString}
            legend={<Legend />}
            recordData={recordData}
            reportName={reconciliationReportName}
            reportUrl={reportUrl}
          />,
          'ORCA Backup': <BackupReport
            filterString={filterString}
            legend={<Legend />}
            recordData={recordData}
            reportName={reconciliationReportName}
            reportType={reportType}
            reportUrl={reportUrl}
          />
        }[reportType]
      }
    </>
  );
};

ReconciliationReport.propTypes = {
  dispatch: PropTypes.func,
  match: PropTypes.object,
  reconciliationReports: PropTypes.object,
};

export { ReconciliationReport };
export default withRouter(
  connect((state) => ({
    reconciliationReports: state.reconciliationReports,
  }))(ReconciliationReport)
);
