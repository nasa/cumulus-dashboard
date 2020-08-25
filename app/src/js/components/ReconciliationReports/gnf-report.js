/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import PropTypes from 'prop-types';
import React from 'react';
import {
  searchReconciliationReport,
  clearReconciliationSearch,
  filterReconciliationReport,
  clearReconciliationReportFilter,
} from '../../actions';
import SortableTable from '../SortableTable/SortableTable';
import { reshapeReport } from './reshape-report';
import { downloadFile } from '../../utils/download-file';
import Search from '../Search/search';
import Dropdown from '../DropDown/dropdown';
import ReportHeading from './report-heading';
import { tableColumnsGnf } from '../../utils/table-config/reconciliation-reports';
import { getCollectionId } from '../../utils/format';

const bucketsForFilter = (allBuckets) => {
  const uniqueBuckets = [...new Set(allBuckets)];
  return uniqueBuckets.map((bucket) => ({
    id: bucket,
    label: bucket,
  }));
};

const GnfReport = ({
  dispatch,
  filterBucket,
  filterString,
  record,
  reportName,
}) => {
  const { data: recordData } = record || {};
  const { granulesInCumulusCmr, reportStartTime = null, reportEndTime = null, error = null } =
    recordData || {};

  const { onlyInCmr, onlyInCumulus } = granulesInCumulusCmr;

  const cmrGranules = onlyInCmr.map((granule) => {
    const { GranuleUR, ShortName, Version } = granule;
    return {
      granuleId: GranuleUR,
      collectionId: getCollectionId({ name: ShortName, version: Version }),
      location: 'cmr'
    };
  });

  const cumulusGranules = onlyInCumulus.map((granule) => ({
    ...granule,
    location: 'cumulus'
  }));

  const allGranules = [...cmrGranules, ...cumulusGranules];

  console.log(allGranules);

  const downloadOptions = [
    {
      label: 'JSON - Full Report',
      onClick: handleDownloadJsonClick,
    },
  ];

  function convertToCSV(data, columns) {
    const csvHeader = columns.map((column) => column.accessor).join(',');

    const csvData = data
      .map((item) => {
        let line = '';
        for (const prop in item) {
          if (line !== '') line += ',';
          line += item[prop];
        }
        return line;
      })
      .join('\r\n');
    return `${csvHeader}\r\n${csvData}`;
  }

  function handleDownloadJsonClick(e) {
    e.preventDefault();
    const jsonHref = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(record.data)
    )}`;
    downloadFile(jsonHref, `${reconciliationReportName}.json`);
  }

  function handleDownloadCsvClick(e, table) {
    e.preventDefault();
    const { name, data: tableData, columns: tableColumns } = table;
    const data = convertToCSV(tableData, tableColumns);
    const csvData = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(csvData);
    downloadFile(url, `${reportName}-${name}.csv`);
  }

  return (
    <div className="page__component">
      <ReportHeading
        downloadOptions={downloadOptions}
        endTime={reportEndTime}
        error={error}
        name={reportName}
        startTime={reportStartTime}
        type='Granule Not Found'
      />
      <section className="page__section">
        <div className="filters">
          <Search
            dispatch={dispatch}
            action={searchReconciliationReport}
            clear={clearReconciliationSearch}
            label="Search"
            placeholder="Search"
          />
          {/* <Dropdown
            action={filterReconciliationReport}
            clear={clearReconciliationReportFilter}
            options={bucketsForFilter(allBuckets)}
            paramKey="bucket"
            label="Bucket"
            inputProps={{
              placeholder: 'All',
            }}
          /> */}
        </div>

        <SortableTable
          data={allGranules}
          tableColumns={tableColumnsGnf}
          shouldUsePagination={true}
          initialHiddenColumns={['']}
        />
      </section>
    </div>
  );
};

GnfReport.propTypes = {
  dispatch: PropTypes.func,
  filterBucket: PropTypes.string,
  filterString: PropTypes.string,
  reportName: PropTypes.string,
  record: PropTypes.object,
};

export default GnfReport;
