'use strict';
import classNames from 'classnames';
import cloneDeep from 'lodash.clonedeep';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import TableCards from './table-cards';
import { Collapse, Dropdown as DropdownBootstrap } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  getReconciliationReport,
  searchReconciliationReport,
  clearReconciliationSearch,
  filterReconciliationReport,
  clearReconciliationReportFilter
} from '../../actions';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import ErrorReport from '../Errors/report';
import Loading from '../LoadingIndicator/loading-indicator';
import SortableTable from '../SortableTable/SortableTable';
import { reshapeReport } from './reshape-report';
import { downloadFile } from '../../utils/download-file';
import Search from '../Search/search';
import Dropdown from '../DropDown/dropdown';

/**
 * returns PASSED or CONFLICT based on reconcilation report data.
 * @param {Object} dataList - list of reconcilation report objects.
 */
const reportState = (dataList) => {
  const anyBad = dataList.some((item) =>
    item.tables.some((table) => table.data.length)
  );
  return anyBad ? 'CONFLICT' : 'PASSED';
};

const bucketsForFilter = (allBuckets) => {
  const uniqueBuckets = [...new Set(allBuckets)];
  return uniqueBuckets.map((bucket) => {
    return {
      id: bucket,
      label: bucket
    };
  });
};

const ReconciliationReport = ({ reconciliationReports, dispatch, match }) => {
  const [activeId, setActiveId] = useState('dynamo');
  const { reconciliationReportName } = match.params;
  const record = reconciliationReports.map[reconciliationReportName];
  const { data: recordData } = record || {};
  const {
    reportStartTime = null,
    reportEndTime = null,
    error = null,
  } = recordData || {};
  const displayStartDate = reportStartTime
    ? new Date(reportStartTime).toLocaleDateString()
    : 'missing';
  const displayEndDate = reportEndTime
    ? new Date(reportEndTime).toLocaleDateString()
    : 'missing';
  const filterBucket = reconciliationReports.list.params.bucket;
  const filterString = reconciliationReports.searchString;
  const { internalComparison, cumulusVsCmrComparison, allBuckets } = reshapeReport(record, filterString, filterBucket);
  const reportComparisons = [...internalComparison, ...cumulusVsCmrComparison];
  const theReportState = reportState(reportComparisons);
  const activeCardTables = reportComparisons.find(
    (displayObj) => displayObj.id === activeId
  ).tables;
  const breadcrumbConfig = [
    {
      label: 'Dashboard Home',
      href: '/',
    },
    {
      label: 'Reports',
      href: '/reconciliation-reports',
    },
    {
      label: reconciliationReportName,
      active: true,
    },
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
    dispatch(getReconciliationReport(reconciliationReportName));
  }, [dispatch, reconciliationReportName]);

  if (!record || (record.inflight && !record.data)) {
    return <Loading />;
  }

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
    for (const key in updatedState) {
      const obj = updatedState[key];
      for (const prop in obj) {
        obj[prop] = expanded;
      }
    }
    setExpandedState(updatedState);
  }

  function allCollapsed() {
    return Object.keys(expandedState[activeId]).every(
      (key) => expandedState[activeId][key] === true
    );
  }

  function convertToCSV(data, columns) {
    const csvHeader = columns
      .map((column) => {
        return column.accessor;
      })
      .join(',');

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
    downloadFile(url, `${reconciliationReportName}-${name}.csv`);
  }

  return (
    <div className="page__component">
      <section className="page__section page__section__controls">
        <div className="reconciliation-reports__options--top">
          <ul>
            <li key="breadcrumbs">
              <Breadcrumbs config={breadcrumbConfig} />
            </li>
          </ul>
        </div>
      </section>
      <section className="page__section page__section__header-wrapper">
        <div className="page__section__header">
          <div>
            <h1 className="heading--large heading--shared-content with-description ">
              {reconciliationReportName}
            </h1>
          </div>
          <div className="status--process">
            <dl className="status--process--report">
              <dt>Date Range:</dt>
              <dd>{`${displayStartDate} to ${displayEndDate}`}</dd>
              <dt>State:</dt>
              <dd
                className={`status__badge status__badge--${
                  theReportState === 'PASSED' ? 'passed' : 'conflict'
                }`}
              >
                {theReportState}
              </dd>
            </dl>
            <DropdownBootstrap className="form-group__element--right">
              <DropdownBootstrap.Toggle
                className="button button--small button--download"
                id="download-report-dropdown"
              >
                Download Report
              </DropdownBootstrap.Toggle>
              <DropdownBootstrap.Menu>
                <DropdownBootstrap.Item
                  as="button"
                  onClick={handleDownloadJsonClick}
                >
                  JSON - Full Report
                </DropdownBootstrap.Item>
                {activeCardTables.map((table, index) => {
                  return (
                    <DropdownBootstrap.Item
                      key={`${activeId}-${index}`}
                      as="button"
                      onClick={(e) => handleDownloadCsvClick(e, table)}
                    >
                      CSV - {table.name}
                    </DropdownBootstrap.Item>
                  );
                })}
              </DropdownBootstrap.Menu>
            </DropdownBootstrap>
          </div>
          {error && <ErrorReport report={error} />}
        </div>
      </section>

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
            <span className="link" onClick={handleExpandClick}>
              {!allCollapsed() ? 'Expand All' : 'Collapse All'}
            </span>
          </div>

          <div className='filters'>
            <Search
              dispatch={dispatch}
              action={searchReconciliationReport}
              clear={clearReconciliationSearch}
              label='Search'
              placeholder='Search'
            />
            <Dropdown
              options={bucketsForFilter(allBuckets)}
              action={filterReconciliationReport}
              clear={clearReconciliationReportFilter}
              paramKey='bucket'
              label='Bucket'
              inputProps={{
                placeholder: 'All'
              }}
            />
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
                      <SortableTable
                        data={item.data}
                        tableColumns={item.columns}
                        shouldUsePagination={true}
                        initialHiddenColumns={['']}
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

ReconciliationReport.propTypes = {
  reconciliationReports: PropTypes.object,
  dispatch: PropTypes.func,
  match: PropTypes.object,
};

ReconciliationReport.defaultProps = {
  reconciliationReports: [],
};

export { ReconciliationReport };
export default withRouter(
  connect((state) => ({
    reconciliationReports: state.reconciliationReports,
  }))(ReconciliationReport)
);
