import classNames from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Collapse } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import TableCards from './table-cards';
import {
  searchReconciliationReport,
  clearReconciliationSearch,
  filterReconciliationReport,
  clearReconciliationReportFilter,
} from '../../actions';
import SortableTable from '../SortableTable/SortableTable';
import { reshapeReport } from './reshape-report';
import { handleDownloadJsonClick, handleDownloadCsvClick } from '../../utils/download-file';
import Search from '../Search/search';
import Dropdown from '../DropDown/dropdown';
import ReportHeading from './report-heading';

/**
 * returns PASSED or CONFLICT based on reconcilation report data.
 * @param {Object} dataList - list of reconcilation report objects.
 */
const reportState = (dataList) => {
  const anyBad = dataList.some((item) => item.tables.some((table) => table.data.length));
  return anyBad ? 'CONFLICT' : 'PASSED';
};

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
  recordData,
  reportName,
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
  console.log(reportComparisons);
  const theReportState = reportState(reportComparisons);
  const activeCardTables = reportComparisons.find(
    (displayObj) => displayObj.id === activeId
  ).tables;

  const downloadOptions = [
    {
      label: 'JSON - Full Report',
      onClick: (e) => handleDownloadJsonClick(e, { data: recordData, reportName })
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

  return (
    <div className="page__component">
      <ReportHeading
        downloadOptions={downloadOptions}
        endTime={reportEndTime}
        error={error}
        name={reportName}
        reportState={theReportState}
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
            <span className="link" onClick={handleExpandClick}>
              {!allCollapsed() ? 'Expand All' : 'Collapse All'}
            </span>
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
              options={[]}
              placeholder="Search"
            />
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

InventoryReport.propTypes = {
  filterBucket: PropTypes.string,
  filterString: PropTypes.string,
  recordData: PropTypes.object,
  reportName: PropTypes.string,
};

export default InventoryReport;
