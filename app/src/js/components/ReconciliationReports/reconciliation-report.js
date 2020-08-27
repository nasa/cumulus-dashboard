import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getReconciliationReport } from '../../actions';
import Loading from '../LoadingIndicator/loading-indicator';
import InventoryReport from './inventory-report';
import GnfReport from './gnf-report';

const ReconciliationReport = ({
  dispatch,
  match,
  reconciliationReports = [],
}) => {
  const { reconciliationReportName } = match.params;
  const { list, map, searchString: filterString } = reconciliationReports;
  const record = map[reconciliationReportName];
  const { type: reportType = 'inventory' } = record || {};
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
          inventory: <InventoryReport
            dispatch={dispatch}
            filterBucket={filterBucket}
            filterString={filterString}
            record={record}
            reportName={reconciliationReportName}
          />,
          gnf: <GnfReport
            dispatch={dispatch}
            filterString={filterString}
            record={record}
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
