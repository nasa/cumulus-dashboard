import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import {
  listProviders,
  filterProviders,
  clearProvidersFilter,
} from '../../actions';
import { lastUpdated } from '../../utils/format';
import { tableColumns } from '../../utils/table-config/providers';
import List from '../Table/Table';
import { filterQueryParams, getPersistentQueryParams } from '../../utils/url-helper';

const ProvidersOverview = () => {
  const providers = useSelector((state) => state.providers);
  const location = useLocation();
  const queryParams = Object.fromEntries(new URLSearchParams(location.search));
  const filteredQueryParams = filterQueryParams(queryParams);

  const { list } = providers;
  const { count, queriedAt } = list.meta;

  const query = useMemo(() => ({ ...filteredQueryParams }), [filteredQueryParams]);

  const bulkActions = useMemo(() => ([
    {
      Component: (
        <Link
          className="button button--green button--add button--small form-group__element"
          to={(toLocation) => ({
            pathname: '/providers/add',
            search: getPersistentQueryParams(toLocation),
          })}
        >
          Add Provider
        </Link>
      ),
    },
  ]), []);

  return (
    <div className="page__component">
      <Helmet>
        <title> Provider </title>
      </Helmet>
      <section className="page__section page__section__header-wrapper">
        <h1 className="heading--large heading--shared-content with-description">
          Provider Overview
        </h1>
        {lastUpdated(queriedAt)}
      </section>
      <section className="page__section">
        <div className="heading__wrapper--border">
          <h2 className="heading--medium heading--shared-content">
            Ingesting Providers
            <span className="num-title">{count ? `${count}` : 0}</span>
          </h2>
        </div>
        <List
          list={list}
          action={listProviders}
          tableColumns={tableColumns}
          query={query}
          bulkActions={bulkActions}
          rowId="name"
          initialSortId="updatedAt"
          filterAction={filterProviders}
          filterClear={clearProvidersFilter}
          tableId="providers"
        ></List>
      </section>
    </div>
  );
};

export default ProvidersOverview;
