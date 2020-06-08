'use strict';
import classNames from 'classnames';
import cloneDeep from 'lodash.clonedeep';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Collapse } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getReconciliationReport } from '../../actions';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import ErrorReport from '../Errors/report';
import Loading from '../LoadingIndicator/loading-indicator';
import SortableTable from '../SortableTable/SortableTable';
import { reshapeReport } from './reshape-report';
import TableCards from './table-cards';

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
        className={`status__badge status__badge--${
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
  const [activeIdx, setActiveIdx] = useState('dynamo');

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

  const [expandedState, setExpandedState] = useState(
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

  const theReportState = reportState(reportComparisons);
  const {
    reportStartTime = null,
    reportEndTime = null,
    error = null,
  } = record.data;

  function handleCardClick(e, id) {
    e.preventDefault();
    setActiveIdx(id);
  }

  function handleToggleClick(e, tableId) {
    e.preventDefault();
    const updatedState = {
      [activeIdx]: {
        ...expandedState[activeIdx],
        [tableId]: !expandedState[activeIdx][tableId],
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
    return Object.keys(expandedState[activeIdx]).every(
      (key) => expandedState[activeIdx][key] === true
    );
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
          {error ? <ErrorReport report={error} /> : null}
        </div>
      </section>

      <section className="page__section page__section--small">
        <div className="tablecard--wrapper">
          <TableCards
            titleCaption="Cumulus intercomparison"
            config={internalComparison}
            onClick={handleCardClick}
            activeCard={activeIdx}
          />
          <TableCards
            titleCaption="Cumulus versus CMR comparison"
            config={cumulusVsCmrComparison}
            onClick={handleCardClick}
            activeCard={activeIdx}
          />
        </div>
      </section>

      <section className="page__section">
        <span className="link" onClick={handleExpandClick}>
          {!allCollapsed() ? 'Expand All' : 'Collapse All'}
        </span>
        <div className="multicard__wrapper">
          {reportComparisons
            .find((displayObj) => displayObj.id === activeIdx)
            .tables.map((item, index) => {
              const isExpanded = expandedState[activeIdx][item.id];
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
