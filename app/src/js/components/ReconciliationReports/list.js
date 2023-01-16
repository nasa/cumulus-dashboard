import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import {
  searchReconciliationReports,
  clearReconciliationReportSearch,
  clearReconciliationReportsFilter,
  listReconciliationReports,
  filterReconciliationReports,
  refreshCumulusDbConnection,
} from '../../actions';
import { lastUpdated } from '../../utils/format';
import { reconciliationReportStatus as statusOptions } from '../../utils/status';
import { reconciliationReportTypes as reportTypeOptions } from '../../utils/type';
import { getPersistentQueryParams } from '../../utils/url-helper';
import {
  tableColumns,
  bulkActions,
} from '../../utils/table-config/reconciliation-reports';
import LoadingEllipsis from '../LoadingEllipsis/loading-ellipsis';
import Dropdown from '../DropDown/dropdown';
import Search from '../Search/search';
import List from '../Table/Table';
import ListFilters from '../ListActions/ListFilters';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';

const breadcrumbConfig = [
  {
    label: 'Dashboard Home',
    href: '/',
  },
  {
    label: 'Reports',
    active: true,
  },
];

const granuleBreadcrumbConfig = [
  {
    label: 'Dashboard Home',
    href: '/',
  },
  {
    label: 'Granules',
    href: '/granules',
  },
  {
    label: 'Lists',
    active: true,
  },
];

const ReconciliationReportList = ({
  dispatch,
  location,
  queryParams,
  reconciliationReports,
}) => {
  const { pathname } = location;
  const isGranules = pathname.includes('granules');
  const { list } = reconciliationReports;
  const { queriedAt, count } = list.meta;
  const query = generateQuery();
  const tableColumnsArray = tableColumns({ dispatch, isGranules, query });

  useEffect(() => {
    dispatch(refreshCumulusDbConnection());
  }, [dispatch]);

  function generateQuery() {
    return {
      [`type${isGranules ? '' : '__not'}`]: 'Granule Inventory',
      ...queryParams,
    };
  }

  function generateBulkActions() {
    return bulkActions(reconciliationReports);
  }

  return (
    <div className="page__component">
      <section className="page__section page__section__controls">
        <Breadcrumbs
          config={isGranules ? granuleBreadcrumbConfig : breadcrumbConfig}
        />
      </section>
      <section className="page__section page__section__header-wrapper">
        <div className="page__section__header">
          <h1 className="heading--large heading--shared-content with-description">
            {isGranules ? 'Lists' : 'Reconciliation Reports Overview'}
          </h1>
          {!isGranules && (
            <Link
              className="button button--green button--file button--small form-group__element--right"
              to={(routerLocation) => ({
                pathname: '/reconciliation-reports/create',
                search: getPersistentQueryParams(routerLocation),
              })}
            >
              {reconciliationReports.createReportInflight
                ? (
                <LoadingEllipsis />
                  )
                : (
                    'Create New Report'
                  )}
            </Link>
          )}
          {lastUpdated(queriedAt)}
        </div>
      </section>
      <section className="page__section">
        <div className="heading__wrapper--border">
          <h2 className="heading--medium heading--shared-content">
            All {isGranules ? 'Lists' : 'Reports'}
            <span className="num-title">{count ? `${count}` : 0}</span>
          </h2>
        </div>
      </section>
      <section className="page__section">
        <List
          list={list}
          action={listReconciliationReports}
          tableColumns={tableColumnsArray}
          query={query}
          bulkActions={generateBulkActions()}
          rowId="name"
          initialSortId="createdAt"
          filterAction={filterReconciliationReports}
          filterClear={clearReconciliationReportsFilter}
          tableId="reconciliationReports"
        >
          <Search
            action={searchReconciliationReports}
            clear={clearReconciliationReportSearch}
            label="Search"
            labelKey="name"
            placeholder={`${isGranules ? 'List' : 'Report'} Name`}
            searchKey="reconciliationReports"
          />
          <ListFilters>
            {!isGranules && (
              <Dropdown
                options={reportTypeOptions}
                action={filterReconciliationReports}
                clear={clearReconciliationReportsFilter}
                paramKey="type"
                label="Report Type"
                inputProps={{
                  placeholder: 'All',
                }}
              />
            )}
            <Dropdown
              options={statusOptions}
              action={filterReconciliationReports}
              clear={clearReconciliationReportsFilter}
              paramKey="status"
              label="Status"
              inputProps={{
                placeholder: 'All',
              }}
            />
          </ListFilters>
        </List>
      </section>
    </div>
  );
};

ReconciliationReportList.propTypes = {
  dispatch: PropTypes.func,
  location: PropTypes.object,
  queryParams: PropTypes.object,
  reconciliationReports: PropTypes.object,
};

export default withRouter(
  connect((state) => ({
    reconciliationReports: state.reconciliationReports,
  }))(ReconciliationReportList)
);
