import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getReconciliationReport } from '../../actions';
import Loading from '../LoadingIndicator/loading-indicator';
import InventoryReport from './inventory-report';
import GnfReport from './gnf-report';
import Legend from './legend';

const ReconciliationReport = ({
  dispatch,
  match,
  reconciliationReports = [],
}) => {
  const { reconciliationReportName } = match.params;
  const { list, map, searchString: filterString } = reconciliationReports;
  const record = map[reconciliationReportName];
  const { data: recordData } = record || {};
  const { reportType = 'Inventory' } = recordData || {};
  const filterBucket = list.params.bucket;

  useEffect(() => {
    dispatch(getReconciliationReport(reconciliationReportName));
  }, [dispatch, reconciliationReportName]);

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
          />,
          'Granule Not Found': <GnfReport
            filterString={filterString}
            legend={<Legend />}
            recordData={recordData}
            reportName={reconciliationReportName}
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
