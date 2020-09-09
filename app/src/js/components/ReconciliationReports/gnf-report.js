import PropTypes from 'prop-types';
import React from 'react';
import groupBy from 'lodash/groupBy';
import {
  searchReconciliationReport,
  clearReconciliationSearch,
} from '../../actions';
import SortableTable from '../SortableTable/SortableTable';
import Search from '../Search/search';
import ReportHeading from './report-heading';
import { handleDownloadJsonClick } from '../../utils/download-file';
import { tableColumnsGnf } from '../../utils/table-config/reconciliation-reports';
import { getFilesSummary, getGranuleFilesSummary } from './reshape-report';
import { getCollectionId } from '../../utils/format';

const GnfReport = ({
  dispatch,
  filterString,
  recordData,
  reportName,
}) => {
  const {
    filesInCumulus,
    granulesInCumulusCmr,
    filesInCumulusCmr,
    createStartTime = null,
    createEndTime = null,
    error = null
  } = recordData || {};

  const { filesInDynamoDb } = getFilesSummary(filesInCumulus);
  const { granuleFilesOnlyInCumulus, granuleFilesOnlyInCmr } = getGranuleFilesSummary(filesInCumulusCmr);

  const { onlyInCmr = [], onlyInCumulus = [] } = granulesInCumulusCmr;

  const cmrGranules = onlyInCmr.map((granule) => {
    const { GranuleUR, ShortName, Version } = granule;
    return {
      ...granule,
      granuleId: GranuleUR,
      collectionId: getCollectionId({ name: ShortName, version: Version }),
      cmr: true,
      cumulus: false,
      s3: false,
    };
  });

  const cumulusGranules = onlyInCumulus.map((granule) => ({
    ...granule,
    cmr: false,
    cumulus: true,
  }));

  const allGranules = [
    ...filesInDynamoDb,
    ...granuleFilesOnlyInCmr,
    ...granuleFilesOnlyInCumulus,
    ...cmrGranules,
    ...cumulusGranules
  ];

  const groupedGranules = groupBy(allGranules, 'granuleId');

  let combinedGranules = Object.entries(groupedGranules).map(([key, value]) => value.reduce((prev, curr) => ({
    ...prev,
    ...curr,
  }), {}));

  if (filterString) {
    combinedGranules = combinedGranules.filter((granule) => granule.granuleId.toLowerCase()
      .includes(filterString.toLowerCase()));
  }

  const reportState = combinedGranules.length > 0 ? 'CONFLICT' : 'PASSED';

  function handleDownloadClick(e) {
    handleDownloadJsonClick(e, { data: recordData, reportName });
  }

  return (
    <div className="page__component">
      <ReportHeading
        endTime={createEndTime}
        error={error}
        name={reportName}
        onDownloadClick={handleDownloadClick}
        reportState={reportState}
        startTime={createStartTime}
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
          data={combinedGranules}
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
  filterString: PropTypes.string,
  recordData: PropTypes.object,
  reportName: PropTypes.string,
};

export default GnfReport;
