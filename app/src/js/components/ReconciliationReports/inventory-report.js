import classNames from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Collapse } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import TableCards from './table-cards';
import {
  searchReconciliationReport,
  clearReconciliationSearch,
  filterReconciliationReport,
  clearReconciliationReportFilter,
  listWorkflows,
  listGranules,
  applyWorkflowToGranule,
  applyRecoveryWorkflowToGranule
} from '../../actions';
import List from '../Table/Table';
import { reshapeReport } from './reshape-report';
import { handleDownloadUrlClick, handleDownloadCsvClick } from '../../utils/download-file';
import Search from '../Search/search';
import Dropdown from '../DropDown/dropdown';
import ReportHeading from './report-heading';
import ListFilters from '../ListActions/ListFilters';
import { 
  bulkActions,
  defaultWorkflowMeta,
  executeDialog,
  groupAction,
  recoverAction
} from '../../utils/table-config/granules';
import { workflowOptionNames } from '../../selectors';

const bucketsForFilter = (allBuckets) => {
  const uniqueBuckets = [...new Set(allBuckets)];
  return uniqueBuckets.map((bucket) => ({
    id: bucket,
    label: bucket,
  }));
};

const InventoryReport = ({
  filterBucket,
  filterString,
  legend,
  recordData,
  reportName,
  reportUrl,
  granules,
  dispatch,
  workflowOptions
}) => {
  const [activeId, setActiveId] = useState('dynamo');
  const { reportStartTime = null, reportEndTime = null, error = null } =
    recordData || {};
  const {
    internalComparison,
    cumulusVsCmrComparison,
    allBuckets,
  } = reshapeReport(recordData, filterString, filterBucket);
  const reportComparisons = [...internalComparison, ...cumulusVsCmrComparison];
  const activeCardTables = reportComparisons.find(
    (displayObj) => displayObj.id === activeId
  ).tables;
  const { list } = granules;
  const [workflow, setWorkflow] = useState(workflowOptions[0]);
  const [workflowMeta, setWorkflowMeta] = useState(defaultWorkflowMeta);
  const [selected, setSelected] = useState([]);
  const downloadOptions = [
    {
      label: 'JSON - Full Report',
      onClick: (e) => handleDownloadUrlClick(e, { url: reportUrl })
    },
    ...activeCardTables.map((table) => ({
      label: `CSV - ${table.name}`,
      onClick: (e) => handleDownloadCsvClick(e, { reportName, table }),
    })),
  ];
  const [expandedState, setExpandedState] = useState(
    reportComparisons.reduce((object, item) => {
      object[item.id] = item.tables.reduce((tableObject, table, index) => {
        // expand the zeroth table in each bucket. collapse all others
        tableObject[table.id] = index === 0;
        return tableObject;
      }, {});
      return object;
    }, {})
  );

  useEffect(() => {
    dispatch(listWorkflows());
  }, [dispatch]);

  useEffect(() => {
    setWorkflow(workflowOptions[0]);
  }, [workflowOptions]);

  function handleCardClick(e, id) {
    e.preventDefault();
    setActiveId(id);
  }

  function handleToggleClick(e, tableId) {
    e.preventDefault();
    const updatedState = {
      [activeId]: {
        ...expandedState[activeId],
        [tableId]: !expandedState[activeId][tableId],
      },
    };
    setExpandedState({
      ...expandedState,
      ...updatedState,
    });
  }

  function handleExpandClick() {
    const updatedState = cloneDeep(expandedState);
    const expanded = !allCollapsed();
    Object.keys(updatedState).forEach((key) => {
      const obj = updatedState[key];
      Object.keys(obj).forEach((prop) => {
        obj[prop] = expanded;
      });
    });
    setExpandedState(updatedState);
  }

  function allCollapsed() {
    return Object.keys(expandedState[activeId]).every(
      (key) => expandedState[activeId][key] === true
    );
  }

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
    const selectedGranules = selected.map((id) => granules.list.data.find((g) => id === g.granuleId));
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

  function applyRecoveryWorkflow (granuleId) {
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
        downloadOptions={downloadOptions}
        endTime={reportEndTime}
        error={error}
        name={reportName}
        startTime={reportStartTime}
        type='Inventory'
      />
      <section className="page__section">
        <div className="heading__wrapper--border">
          <h2 className="heading--medium heading--shared-content with-description">
            Bucket Status
          </h2>
        </div>
        <p className="description">
          Click on the bucket to see comparison report details below.
        </p>
        <div className="tablecard--wrapper">
          <TableCards
            titleCaption="Cumulus (DynamoDB) versus S3"
            config={internalComparison}
            onClick={handleCardClick}
            activeCard={activeId}
          />
          <TableCards
            titleCaption="Cumulus versus CMR"
            config={cumulusVsCmrComparison}
            onClick={handleCardClick}
            activeCard={activeId}
          />
        </div>
      </section>

      <section className="page__section">
        <div className="multicard">
          <div className="collapse-link">
            <span className="link" onClick={handleExpandClick} role="button" tabIndex="0">
              {!allCollapsed() ? 'Expand All' : 'Collapse All'}
            </span>
          </div>

          <div className="list-action-wrapper">
            <Search
              action={searchReconciliationReport}
              clear={clearReconciliationSearch}
              label="Search"
              labelKey="granuleId"
              options={[]}
              placeholder="Search"
            />
            <ListFilters>
              <Dropdown
                options={bucketsForFilter(allBuckets)}
                action={filterReconciliationReport}
                clear={clearReconciliationReportFilter}
                paramKey="bucket"
                label="Bucket"
                inputProps={{
                  placeholder: 'All',
                }}
              />
            </ListFilters>
          </div>

          {reportComparisons
            .find((displayObj) => displayObj.id === activeId)
            .tables.map((item, index) => {
              const isExpanded = expandedState[activeId][item.id];
              return (
                <div className="multicard__table" key={index}>
                  <Card.Header
                    className={classNames({
                      multicard__header: true,
                      'multicard__header--expanded': isExpanded,
                    })}
                    key={index}
                    onClick={(e) => handleToggleClick(e, item.id)}
                    aria-controls={item.id}
                  >
                    {item.name}
                    <span
                      className={classNames({
                        'num-title--inverted': !isExpanded,
                        'num-title': isExpanded,
                      })}
                    >
                      {item.data.length}
                    </span>
                    <span
                      className={classNames({
                        'expand-icon': !isExpanded,
                        'collapse-icon': isExpanded,
                      })}
                    ></span>
                  </Card.Header>
                  <Collapse in={isExpanded}>
                    <div id={item.id}>
                      <List
                        list={list}
                        action={listGranules}
                        data={item.data}
                        legend={legend}
                        tableColumns={item.columns}
                        bulkActions={generateBulkActions()}
                        groupAction={groupAction}
                        rowId="granuleId"
                        shouldUsePagination={true}
                        initialHiddenColumns={['']}
                        onSelect={updateSelection}
                      />
                    </div>
                  </Collapse>
                </div>
              );
            })}
        </div>
      </section>
    </div>
  );
};

InventoryReport.propTypes = {
  filterBucket: PropTypes.string,
  filterString: PropTypes.string,
  legend: PropTypes.node,
  recordData: PropTypes.object,
  reportName: PropTypes.string,
  reportUrl: PropTypes.string,
  dispatch: PropTypes.func,
  granules: PropTypes.object,
  workflowOptions: PropTypes.array
};

export default withRouter(
  connect((state) => ({
    granules: state.granules,
    workflowOptions: workflowOptionNames(state)
  }))(InventoryReport)
);
