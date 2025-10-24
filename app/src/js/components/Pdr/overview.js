import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Link, useLocation } from 'react-router-dom';
import { listPdrs, getCount, clearPdrsFilter, filterPdrs } from '../../actions';
import { lastUpdated, tally } from '../../utils/format';
import { bulkActions } from '../../utils/table-config/pdrs';
import { tableColumns } from '../../utils/table-config/pdr-progress';
import List from '../Table/Table';
import Overview from '../Overview/overview';
import Dropdown from '../DropDown/dropdown';
import statusOptions from '../../utils/status';
import ListFilters from '../ListActions/ListFilters';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import { filterQueryParams, getPersistentQueryParams } from '../../utils/url-helper';

const breadcrumbConfig = [
  {
    label: 'Dashboard Home',
    href: '/',
  },
  {
    label: 'PDRs',
    active: true,
  },
];

const PdrOverview = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = Object.fromEntries(new URLSearchParams(location.search));
  const filteredQueryParams = filterQueryParams(queryParams);

  useEffect(() => {
    const queryStats = () => {
      dispatch(
        getCount({
          type: 'pdrs',
          field: 'status',
          ...filteredQueryParams,
        })
      );
    };
    queryStats();
  }, [dispatch, filteredQueryParams]);

  const generateQuery = () => (
    { ...filteredQueryParams }
  );

  const pdrs = useSelector((state) => state.pdrs);

  const generateBulkActions = () => bulkActions(pdrs);

  const { list } = pdrs;
  const { count, queriedAt } = list.meta;

  return (
    <div className="page__component">
      <Helmet>
        <title> Cumulus PDRs </title>
      </Helmet>
      <section className="page__section page__section__controls">
        <Breadcrumbs config={breadcrumbConfig} />
      </section>
      <section className="page__section page__section__header-wrapper">
        <h1 className="heading--large heading--shared-content with-description">
          PDR Overview
        </h1>
        {lastUpdated(queriedAt)}
        <Overview type="pdrs" inflight={pdrs.list.inflight} />
      </section>
      <section className="page__section">
        <div className="heading__wrapper--border">
          <h2 className="heading--medium heading--shared-content with-description">
            All PDRs
            <span className="num-title">
              {count ? ` ${tally(count)}` : 0}
            </span>
          </h2>
        </div>
        <List
          list={list}
          action={listPdrs}
          tableColumns={tableColumns}
          initialSortId="updatedAt"
          query={generateQuery()}
          bulkActions={generateBulkActions()}
          rowId="pdrName"
          filterAction={filterPdrs}
          filterClear={clearPdrsFilter}
          tableId="pdrs-overview"
        >
          <ListFilters>
            <Dropdown
              options={statusOptions}
              action={filterPdrs}
              clear={clearPdrsFilter}
              paramKey="status"
              label="Status"
            />
          </ListFilters>
        </List>
        <Link
          className="link--secondary link--learn-more"
          to={(toLocation) => ({
            pathname: '/pdrs/active',
            search: getPersistentQueryParams(toLocation),
          })}
        >
          View Currently Active PDRs
        </Link>
      </section>
    </div>
  );
};

export default PdrOverview;
