import React, { useEffect } from 'react';
// import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  searchReconciliationReports,
  clearReconciliationReportSearch,
  clearReconciliationReportsFilter,
  listReconciliationReports,
  filterReconciliationReports,
} from '../../actions';
import { lastUpdated } from '../../utils/format';
import { reconciliationReportStatus as statusOptions } from '../../utils/status';
import { reconciliationReportTypes as reportTypeOptions } from '../../utils/type';
// import { getPersistentQueryParams } from '../../utils/url-helper';
import {
  tableColumns,
  bulkActions,
} from '../../utils/table-config/reconciliation-reports';
// import LoadingEllipsis from '../LoadingEllipsis/loading-ellipsis';
import Dropdown from '../DropDown/dropdown';
import Search from '../Search/search';
import List from '../Table/Table';
import ListFilters from '../ListActions/ListFilters';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
// import withRouter from '../../withRouter';
import { withUrlHelper } from '../../withUrlHelper';
import CreateNewReportButton from './CreateNewReportButton';

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

const ReconciliationReportList = ({ urlHelper }) => {
  const dispatch = useDispatch();
  const { getPersistentQueryParams, location, queryParams } = urlHelper;
  const { pathname } = location;
  const isGranules = pathname.includes('granules');
  const reconciliationReports = useSelector((state) => state.reconciliationReports);
  const { list } = reconciliationReports;
  const { queriedAt, count } = list.meta;
  const query = generateQuery();
  const tableColumnsArray = tableColumns({ dispatch, isGranules, query });
  const { createReportInflight } = reconciliationReports;

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
            <CreateNewReportButton
              createReportInflight={createReportInflight}
              getPersistentQueryParams={getPersistentQueryParams}
            />
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
          initialSortId="updatedAt"
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
  urlHelper: PropTypes.shape({
    location: PropTypes.object,
    getPersistentQueryParams: PropTypes.func,
    queryParams: PropTypes.object
  }),
};

export default withUrlHelper(ReconciliationReportList);
