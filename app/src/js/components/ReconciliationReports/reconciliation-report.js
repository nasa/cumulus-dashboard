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
  const { data: recordData } = record || {};
  const { type: reportType = 'Inventory' } = recordData || {};
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
            dispatch={dispatch}
            filterBucket={filterBucket}
            filterString={filterString}
            recordData={recordData}
            reportName={reconciliationReportName}
          />,
          GranuleNotFound: <GnfReport
            dispatch={dispatch}
            filterString={filterString}
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
