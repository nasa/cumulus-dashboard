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

const ActivePdrs = ({ dispatch, location, pdrs, queryParams }) => {
  const { list } = pdrs;
  const { count, queriedAt } = list.meta;
  const query = generateQuery();
  const view = getView();
  const displayCaseView = displayCase(view);
  const breadcrumbConfig = [
    {
      label: 'Dashboard Home',
      href: '/',
    },
    {
      label: 'PDRs',
      href: '/pdrs',
    },
    {
      label: displayCaseView,
      active: true,
    },
  ];

  function generateQuery() {
    const currentQuery = { ...queryParams };
    const { pathname } = location;
    if (pathname === '/pdrs/completed') currentQuery.status = 'completed';
    else if (pathname === '/pdrs/failed') currentQuery.status = 'failed';
    else if (pathname === '/pdrs/active') currentQuery.status = 'running';
    return currentQuery;
  }

  function getView() {
    const { pathname } = location;
    if (pathname === '/pdrs/completed') return 'completed';
    if (pathname === '/pdrs/failed') return 'failed';
    if (pathname === '/pdrs/active') return 'active';
    return 'all';
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
          dispatch={dispatch}
          action={listPdrs}
          tableColumns={view === 'failed' ? errorTableColumns : tableColumns}
          query={query}
          bulkActions={generateBulkActions()}
          rowId="pdrName"
          sortId="timestamp"
          filterAction={filterPdrs}
          filterClear={clearPdrsFilter}
        >
          <ListFilters>
            <Search
              action={searchPdrs}
              clear={clearPdrsSearch}
              inputProps={{
                className: 'search search--large',
              }}
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
  location: PropTypes.object,
  dispatch: PropTypes.func,
  pdrs: PropTypes.object,
  queryParams: PropTypes.object,
};

export default withRouter(
  connect((state) => ({
    pdrs: state.pdrs,
  }))(ActivePdrs)
);
