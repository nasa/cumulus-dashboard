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

const BackupReport = ({
  filterString,
  legend,
  onSelect,
  recordData,
  reportName,
  reportType,
  reportUrl
}) => {
  const {
    createStartTime = null,
    createEndTime = null,
    error = null,
    granules: {
      withConflicts = [],
      onlyInCumulus = [],
      onlyInOrca = []
    }
  } = recordData || {};

  const records = withConflicts.map((g) => ({ ...g, conflictType: 'withConflicts' })).concat(
    onlyInCumulus.map((g) => ({ ...g, conflictType: 'onlyInCumulus' })),
    onlyInOrca.map((g) => ({ ...g, conflictType: 'onlyInOrca' }))
  );

  function handleDownloadClick(e) {
    handleDownloadUrlClick(e, { url: reportUrl });
  }

  return (
    <div className="page__component">
      <ReportHeading
        conflictComparisons={records.length}
        endTime={createEndTime}
        error={error}
        name={reportName}
        onDownloadClick={handleDownloadClick}
        startTime={createStartTime}
        type='ORCA Backup'
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
          data={records}
          legend={legend}
          onSelect={onSelect}
          rowId="granuleId"
          tableColumns={tableColumnsBackupAndRecovery({ reportName, reportType })}
          useSimplePagination={true}
        />
      </section>
    </div>
  );
};

BackupReport.propTypes = {
  filterString: PropTypes.string,
  legend: PropTypes.node,
  onSelect: PropTypes.func,
  recordData: PropTypes.object,
  reportName: PropTypes.string,
  reportType: PropTypes.string,
  reportUrl: PropTypes.string
};

export default BackupReport;
