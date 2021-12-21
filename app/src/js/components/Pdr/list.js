import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  searchPdrs,
  clearPdrsSearch,
  listPdrs,
  filterPdrs,
  clearPdrsFilter,
} from '../../actions';
import { lastUpdated, tally, displayCase } from '../../utils/format';
import {
  tableColumns,
  errorTableColumns,
  bulkActions,
} from '../../utils/table-config/pdrs';
import Search from '../Search/search';
import List from '../Table/Table';

import ListFilters from '../ListActions/ListFilters';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';

const generateBreadcrumbConfig = (view) => [
  {
    label: 'Dashboard Home',
    href: '/',
  },
  {
    label: 'PDRs',
    href: '/pdrs',
  },
  {
    label: view,
    active: true,
  },
];

const ActivePdrs = ({ match, pdrs, queryParams }) => {
  const { list } = pdrs;
  const { count, queriedAt } = list.meta;
  const {
    params: { status: paramStatus },
  } = match;
  const status = paramStatus === 'active' ? 'running' : paramStatus;
  const query = generateQuery();
  const displayCaseView = displayCase(paramStatus);
  const breadcrumbConfig = generateBreadcrumbConfig(displayCaseView);

  function generateQuery() {
    const currentQuery = { ...queryParams };
    currentQuery.status = status;
    return currentQuery;
  }

  function generateBulkActions() {
    return bulkActions(pdrs);
  }
  return (
    <div className="page__component">
      <section className="page__section">
        <section className="page__section page__section__controls">
          <Breadcrumbs config={breadcrumbConfig} />
        </section>
        <div className="page__section__header page__section__header-wrapper">
          <h1 className="heading--large heading--shared-content with-description">
            {displayCaseView} PDRs
            <span className="num-title">
              {!Number.isNaN(+count) ? `${tally(count)}` : 0}
            </span>
          </h1>
          {lastUpdated(queriedAt)}
        </div>
        <List
          list={list}
          action={listPdrs}
          tableColumns={status === 'failed' ? errorTableColumns : tableColumns}
          query={query}
          bulkActions={generateBulkActions()}
          rowId="pdrName"
          initialSortId="timestamp"
          filterAction={filterPdrs}
          filterClear={clearPdrsFilter}
          tableId="pdrs"
        >
          <ListFilters>
            <Search
              action={searchPdrs}
              clear={clearPdrsSearch}
              labelKey="pdrName"
              searchKey="pdrs"
            />
          </ListFilters>
        </List>
      </section>
    </div>
  );
};

ActivePdrs.propTypes = {
  match: PropTypes.object,
  pdrs: PropTypes.object,
  queryParams: PropTypes.object,
};

export default withRouter(
  connect((state) => ({
    pdrs: state.pdrs,
  }))(ActivePdrs)
);
