import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import groupBy from 'lodash/groupBy';
import {
  searchReconciliationReport,
  clearReconciliationSearch,
  listWorkflows,
  listGranules,
  applyWorkflowToGranule,
  applyRecoveryWorkflowToGranule
} from '../../actions';
import List from '../Table/Table';
import Search from '../Search/search';
import ReportHeading from './report-heading';
import { handleDownloadUrlClick } from '../../utils/download-file';
import { tableColumnsGnf } from '../../utils/table-config/reconciliation-reports';
import { getFilesSummary, getGranuleFilesSummary } from './reshape-report';
import { getCollectionId } from '../../utils/format';
import {
  bulkActions,
  defaultWorkflowMeta,
  executeDialog,
  groupAction,
  recoverAction
} from '../../utils/table-config/granules';
import { workflowOptionNames } from '../../selectors';

const GnfReport = ({
  dispatch,
  filterString,
  granules,
  legend,
  recordData,
  reportName,
  reportUrl,
  workflowOptions
}) => {
  const {
    filesInCumulus,
    granulesInCumulusCmr,
    filesInCumulusCmr,
    createStartTime = null,
    createEndTime = null,
    error = null
  } = recordData || {};

  const { list } = granules;

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
    const { s3, cumulus, cmr } = currentGranuleData;
    const missingS3 = s3 === false || (typeof s3 === 'string' && s3.match(/^(notFound|missing)$/)) ? 1 : 0;
    const missingCumulus = cumulus === false || (typeof cumulus === 'string' && cumulus.match(/^(notFound|missing)$/)) ? 1 : 0;
    const missingCmr = cmr === false || (typeof cmr === 'string' && cmr.match(/^(notFound|missing)$/)) ? 1 : 0;

    return totalMissing + missingS3 + missingCumulus + missingCmr;
  }

  const totalMissingGranules = combinedGranules.reduce(calculateMissingGranules, 0);

  const [workflow, setWorkflow] = useState(workflowOptions[0]);
  const [workflowMeta, setWorkflowMeta] = useState(defaultWorkflowMeta);
  const [selected, setSelected] = useState([]);

  function handleDownloadClick(e) {
    handleDownloadUrlClick(e, { url: reportUrl });
  }

  useEffect(() => {
    dispatch(listWorkflows());
  }, [dispatch]);

  useEffect(() => {
    setWorkflow(workflowOptions[0]);
  }, [workflowOptions]);

  function generateBulkActions() {
    const config = {
      execute: {
        options: getExecuteOptions(),
        action: applyWorkflow,
      },
      recover: {
        options: getExecuteOptions(),
        action: applyRecoveryWorkflow
      }
    };
    const selectedGranules = selected;
    let actions = bulkActions(granules, config, selectedGranules);
    if (config.enableRecovery) {
      actions = actions.concat(recoverAction(granules, config));
    }
    return actions;
  }

  function selectWorkflow(selector, selectedWorkflow) {
    setWorkflow(selectedWorkflow);
  }

  function applyWorkflow(granuleId) {
    const { meta } = JSON.parse(workflowMeta);
    setWorkflowMeta(defaultWorkflowMeta);
    return applyWorkflowToGranule(granuleId, workflow, meta);
  }

  function applyRecoveryWorkflow(granuleId) {
    return applyRecoveryWorkflowToGranule(granuleId);
  }

  function getExecuteOptions() {
    return [
      executeDialog({
        selectHandler: selectWorkflow,
        label: 'workflow',
        value: workflow,
        options: workflowOptions,
        initialMeta: workflowMeta,
        metaHandler: setWorkflowMeta,
      }),
    ];
  }

  function updateSelection(selection) {
    setSelected(selection);
  }

  return (
    <div className="page__component">
      <ReportHeading
        conflictComparisons={totalMissingGranules}
        endTime={createEndTime}
        error={error}
        name={reportName}
        onDownloadClick={handleDownloadClick}
        startTime={createStartTime}
        type='Granule Not Found'
      />
      <section className="page__section">
        <div className="list-action-wrapper">
          <Search
            action={searchReconciliationReport}
            clear={clearReconciliationSearch}
            label="Search"
            labelKey="granuleId"
            options={combinedGranules}
            placeholder="Search"
          />
        </div>
        <List
          list={list}
          action={listGranules}
          data={combinedGranules}
          legend={legend}
          tableColumns={tableColumnsGnf}
          bulkActions={generateBulkActions()}
          groupAction={groupAction}
          rowId="granuleId"
          shouldUsePagination={true}
          initialHiddenColumns={['']}
          onSelect={updateSelection}
        />
      </section>
    </div>
  );
};

GnfReport.propTypes = {
  dispatch: PropTypes.func,
  granules: PropTypes.object,
  filterString: PropTypes.string,
  legend: PropTypes.node,
  recordData: PropTypes.object,
  reportName: PropTypes.string,
  reportUrl: PropTypes.string,
  workflowOptions: PropTypes.array
};

export default withRouter(
  connect((state) => ({
    granules: state.granules,
    workflowOptions: workflowOptionNames(state)
  }))(GnfReport)
);
