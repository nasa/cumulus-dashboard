import PropTypes from 'prop-types';
import React from 'react';
import {
  searchReconciliationReport,
  clearReconciliationSearch,
} from '../../actions';
import SortableTable from '../SortableTable/SortableTable';
import Search from '../Search/search';
import ReportHeading from './report-heading';
import { handleDownloadJsonClick } from '../../utils/download-file';
import { tableColumnsGnf } from '../../utils/table-config/reconciliation-reports';
import { getCollectionId } from '../../utils/format';

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

  let allGranules = [...cmrGranules, ...cumulusGranules];

  if (filterString) {
    allGranules = allGranules.filter((granule) => granule.granuleId.toLowerCase()
      .includes(filterString.toLowerCase()));
  }

  const reportState = allGranules.length > 0 ? 'CONFLICT' : 'PASSED';

  const downloadOptions = [
    {
      label: 'JSON - Full Report',
      onClick: (e) => handleDownloadJsonClick(e, { data: recordData, reportName }),
    },
  ];

  return (
    <div className="page__component">
      <ReportHeading
        downloadOptions={downloadOptions}
        endTime={reportEndTime}
        error={error}
        name={reportName}
        reportState={reportState}
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
