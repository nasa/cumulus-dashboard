'use strict';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import TableCards from './table-cards';
import { Collapse, Dropdown as DropdownBootstrap } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getReconciliationReport } from '../../actions';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import ErrorReport from '../Errors/report';
import Loading from '../LoadingIndicator/loading-indicator';
import SortableTable from '../SortableTable/SortableTable';
import { reshapeReport } from './reshape-report';
import cloneDeep from 'lodash.clonedeep';
import { downloadFile } from '../../utils/download-file';

const breadcrumbConfig = [
  {
    label: 'Dashboard Home',
    href: '/',
  },
  {
    label: 'Reports Overview',
    href: '/reconciliation-reports',
  },
  {
    label: 'Report',
    active: true,
  },
];

const ReportStateHeader = ({ reportState, startDate, endDate }) => {
  const displayStartDate = startDate
    ? new Date(startDate).toLocaleDateString()
    : 'missing';
  const displayEndDate = endDate
    ? new Date(startDate).toLocaleDateString()
    : 'missing';
  return (
    <>
      <b>Date Range:</b> {displayStartDate} to {displayEndDate} <b>state:</b>{' '}
      <span
        className={`status__badge status__badge__${
          reportState === 'PASSED' ? 'passed' : 'conflict'
        }`}
      >
        {' '}
        {reportState}{' '}
      </span>
    </>
  );
};

ReportStateHeader.propTypes = {
  reportState: PropTypes.string,
  endDate: PropTypes.string,
  startDate: PropTypes.string,
};

/**
 * returns PASSED or CONFLICT based on reconcilation report data.
 * @param {Object} dataList - reshaped report data
 */
const reportState = (dataList) => {
  const anyBad = dataList.some((item) =>
    item.tables.some((table) => table.data.length)
  );
  return anyBad ? 'CONFLICT' : 'PASSED';
};

const ReconciliationReport = ({ reconciliationReports, dispatch, match }) => {
  const [activeId, setactiveId] = useState('dynamo');
  const [allExpanded, setAllExpanded] = useState(false);

  const { reconciliationReportName } = match.params;

  useEffect(() => {
    const { reconciliationReportName } = match.params;
    if (!reconciliationReports.map[reconciliationReportName]) {
      dispatch(getReconciliationReport(reconciliationReportName));
    }
  }, [dispatch, match.params, reconciliationReports.map]);

  const record = reconciliationReports.map[reconciliationReportName];

  const { internalComparison, cumulusVsCmrComparison } = reshapeReport(record);
  const reportComparisons = [...internalComparison, ...cumulusVsCmrComparison];

  const [collapseState, setCollapseState] = useState(
    reportComparisons.reduce((object, item) => {
      object[item.id] = item.tables.reduce((tableObject, table) => {
        tableObject[table.id] = false;
        return tableObject;
      }, {});
      return object;
    }, {})
  );

  if (!record || (record.inflight && !record.data)) {
    return <Loading />;
  }

  const theReportState = reportState([
    ...internalComparison,
    ...cumulusVsCmrComparison,
  ]);
  const {
    reportStartTime = null,
    reportEndTime = null,
    error = null,
  } = record.data;

  const activeCardTables = reportComparisons.find((displayObj) => displayObj.id === activeId).tables;

  function handleCardClick(e, id) {
    e.preventDefault();
    setactiveId(id);
  }

  function handleToggleClick(e, tableId) {
    e.preventDefault();
    const updatedState = {
      [activeId]: {
        ...collapseState[activeId],
        [tableId]: !collapseState[activeId][tableId],
      },
    };
    setCollapseState({
      ...collapseState,
      ...updatedState,
    });
  }

  function handleExpandClick() {
    const updatedState = cloneDeep(collapseState);
    const expanded = !allExpanded;
    for (const key in updatedState) {
      const obj = updatedState[key];
      for (const prop in obj) {
        obj[prop] = expanded;
      }
    }
    setAllExpanded(expanded);
    setCollapseState(updatedState);
  }

  function convertToCSV(data, columns) {
    const csvHeader = columns.map((column) => {
      return column.accessor;
    }).join(',');

    const csvData = data.map((item) => {
      let line = '';
      for (const prop in item) {
        if (line !== '') line += ',';
        line += item[prop];
      }
      return line;
    }).join('\r\n');

    return `${csvHeader}\r\n${csvData}`;
  }

  function handleDownloadJsonClick (e) {
    e.preventDefault();
    const jsonHref = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(record.data))}`;
    downloadFile(jsonHref, `${reconciliationReportName}.json`);
  }

  function handleDownloadCsvClick (e, table) {
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
          <ReportStateHeader
            reportState={theReportState}
            startDate={reportStartTime}
            endDate={reportEndTime}
          />
          <DropdownBootstrap className='form-group__element--right'>
            <DropdownBootstrap.Toggle className='button button--small button--download' id="download-report-dropdown">
                Download Report
            </DropdownBootstrap.Toggle>
            <DropdownBootstrap.Menu>
              <DropdownBootstrap.Item as='button' onClick={handleDownloadJsonClick}>JSON - Full Report</DropdownBootstrap.Item>
              {activeCardTables.map((table, index) => {
                return <DropdownBootstrap.Item key={`${activeId}-${index}`} as='button' onClick={(e) => handleDownloadCsvClick(e, table)}>CSV - {table.name}</DropdownBootstrap.Item>;
              })}
            </DropdownBootstrap.Menu>
          </DropdownBootstrap>
          {error ? <ErrorReport report={error} /> : null}
        </div>
      </section>

      <section className="page__section page__section--small">
        <div className="tablecard--wrapper">
          <TableCards
            titleCaption="Cumulus intercomparison"
            config={internalComparison}
            onClick={handleCardClick}
            activeCard={activeId}
          />
          <TableCards
            titleCaption="Cumulus versus CMR comparison"
            config={cumulusVsCmrComparison}
            onClick={handleCardClick}
            activeCard={activeId}
          />
        </div>
      </section>

      <section className="page__section">
        <span onClick={handleExpandClick}>TOGGLE</span>
        <div className="accordion__wrapper">
          {activeCardTables.map((item, index) => {
            return (
              <div className="accordion__table" key={index}>
                <Card.Header
                  key={index}
                  onClick={(e) => handleToggleClick(e, item.id)}
                  aria-controls={item.id}
                >
                  {item.name}
                  <span className="num-title--inverted">
                    {item.data.length}
                  </span>
                  <span className="expand-icon"></span>
                </Card.Header>
                <Collapse in={collapseState[activeId][item.id]}>
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
