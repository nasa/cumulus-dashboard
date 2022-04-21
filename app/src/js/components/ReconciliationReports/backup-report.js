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
import { tableColumnsBackup } from '../../utils/table-config/reconciliation-reports';

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
    reportStartTime = null,
    reportEndTime = null,
    error = null,
    granules: {
      withConflicts = [],
      onlyInCumulus = [],
      onlyInOrca = []
    }
  } = recordData || {};

  let records = withConflicts.map((g) => ({ ...g, conflictType: 'withConflicts' })).concat(
    onlyInCumulus.map((g) => ({ ...g, conflictType: 'onlyInCumulus' })),
    onlyInOrca.map((g) => ({ ...g, conflictType: 'onlyInOrca' }))
  );

  if (filterString) {
    records = records.filter((file) => file.granuleId.toLowerCase()
      .includes(filterString.toLowerCase()));
  }

  function handleDownloadClick(e) {
    handleDownloadUrlClick(e, { url: reportUrl });
  }

  return (
    <div className="page__component">
      <ReportHeading
        conflictComparisons={records.length}
        endTime={reportEndTime}
        error={error}
        name={reportName}
        onDownloadClick={handleDownloadClick}
        startTime={reportStartTime}
        type={reportType}
      />
      <section className="page__section">
        <div className="list-action-wrapper">
          <Search
            action={searchReconciliationReport}
            clear={clearReconciliationSearch}
            label="Search"
            labelKey="granuleId"
            placeholder="Search"
          />
        </div>
        <List
          data={records}
          onSelect={onSelect}
          rowId="granuleId"
          tableColumns={tableColumnsBackup({ reportName, reportType })}
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
