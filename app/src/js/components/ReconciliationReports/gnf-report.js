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

  function calculateMissingGranules(totalMissing, currentGranuleData) {
    const missingS3 = currentGranuleData.s3 === 'notFound' || currentGranuleData.s3 === false ? 1 : 0;
    const missingCumulus = currentGranuleData.cumulus === 'notFound' || currentGranuleData.cumulus === false ? 1 : 0;
    const missingCmr = currentGranuleData.cmr === 'notFound' || currentGranuleData.cmr === false ? 1 : 0;

    return totalMissing + missingS3 + missingCumulus + missingCmr;
  }

  const totalMissingGranules = combinedGranules.reduce(calculateMissingGranules, 0);

  const reportState = combinedGranules.length > 0 ? 'CONFLICT' : 'PASSED';

  function handleDownloadClick(e) {
    handleDownloadJsonClick(e, { data: recordData, reportName });
  }

  return (
    <div className="page__component">
      <div className="heading__wrapper">
        <ReportHeading
          endTime={createEndTime}
          error={error}
          name={reportName}
          onDownloadClick={handleDownloadClick}
          reportState={reportState}
          startTime={createStartTime}
          type='Granule Not Found'
        />
      </div>
      <section className="page__section">
        <div className="title-count">
          <h2 className="heading--medium heading--shared-content with-description">
            Granules Not Found <span className="num-title">{totalMissingGranules}</span>
          </h2>
        </div>
        <div className="filters">
          <Search
            action={searchReconciliationReport}
            clear={clearReconciliationSearch}
            inputProps={{
              className: 'search search--large',
            }}
            label="Search"
            labelKey="granuleId"
            options={combinedGranules}
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
  filterString: PropTypes.string,
  recordData: PropTypes.object,
  reportName: PropTypes.string,
};

export default GnfReport;
