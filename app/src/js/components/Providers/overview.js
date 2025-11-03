import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  listProviders,
  filterProviders,
  clearProvidersFilter,
} from '../../actions';
import { lastUpdated } from '../../utils/format';
import { tableColumns } from '../../utils/table-config/providers';
import List from '../Table/Table';
import { getPersistentQueryParams } from '../../utils/url-helper';

const ProvidersOverview = ({ queryParams }) => {
  const providers = useSelector((state) => state.providers);

  const { list } = providers;
  const { count, queriedAt } = list.meta;

  const generateQuery = () => ({ ...queryParams });

  const bulkActions = useMemo(() => ([
    {
      Component: (
        <Link
          className="button button--green button--add button--small form-group__element"
          to={(location) => ({
            pathname: '/providers/add',
            search: getPersistentQueryParams(location),
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
          query={generateQuery()}
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

ProvidersOverview.propTypes = {
  queryParams: PropTypes.object,
};

export default withRouter(
  (ProvidersOverview)
);
