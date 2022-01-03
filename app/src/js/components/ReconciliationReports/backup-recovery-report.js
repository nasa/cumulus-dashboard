/**
 * TODO: This component should be completed as part of CUMULUS-2748
 */

import PropTypes from 'prop-types';
import React from 'react';
import {
  searchReconciliationReport,
  clearReconciliationSearch,
} from '../../actions';
import List from '../Table/Table';
import Search from '../Search/search';
import ReportHeading from './report-heading';
import { handleDownloadUrlClick } from '../../utils/download-file';
import { tableColumnsBackupAndRecovery } from '../../utils/table-config/reconciliation-reports';

const BackupRecoveryReport = ({
  filterString,
  legend,
  onSelect,
  recordData,
  reportName,
  reportUrl
}) => {
  const {
    createStartTime = null,
    createEndTime = null,
    error = null
  } = recordData || {};

  function handleDownloadClick(e) {
    handleDownloadUrlClick(e, { url: reportUrl });
  }

  return (
    <div className="page__component">
      <ReportHeading
        endTime={createEndTime}
        error={error}
        name={reportName}
        onDownloadClick={handleDownloadClick}
        startTime={createStartTime}
        type='Backup and Recovery' // TODO: verify this matches the "type" returned from the API
      />
      <section className="page__section">
        <div className="list-action-wrapper">
          <Search
            action={searchReconciliationReport}
            clear={clearReconciliationSearch}
            label="Search"
            labelKey="granuleId"
            // options={combinedGranules}
            placeholder="Search"
          />
        </div>
        <List
          data={[]}
          legend={legend}
          onSelect={onSelect}
          rowId="granuleId"
          tableColumns={tableColumnsBackupAndRecovery}
          useSimplePagination={true}
        />
      </section>
    </div>
  );
};

BackupRecoveryReport.propTypes = {
  filterString: PropTypes.string,
  legend: PropTypes.node,
  onSelect: PropTypes.func,
  recordData: PropTypes.object,
  reportName: PropTypes.string,
  reportUrl: PropTypes.string
};

export default BackupRecoveryReport;
