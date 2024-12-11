import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { get } from 'object-path';
import cloneDeep from 'lodash/cloneDeep';
import PropTypes from 'prop-types';
import {
  listProviders,
  getCount,
  filterProviders,
  clearProvidersFilter,
} from '../../actions';
import { lastUpdated } from '../../utils/format';
import { tableColumns } from '../../utils/table-config/providers';
import List from '../Table/Table';
import { withUrlHelper } from '../../withUrlHelper';

const ProvidersOverview = ({ urlHelper }) => {
  const dispatch = useDispatch();
  const { location, queryParams, getPersistentQueryParams } = urlHelper;

  const providers = useSelector((state) => state.providers);
  const stats = useSelector((state) => state.stats);

  useEffect(() => {
    dispatch(getCount({
      type: 'collections',
      field: 'providers',
    }));
  }, [dispatch]);

  const generateQuery = () => ({ ...queryParams });

  const { list } = providers;
  const { count, queriedAt } = list.meta;
  // Incorporate the collection counts into the `list`
  const mutableList = cloneDeep(list);
  const collectionCounts = get(stats.count, 'data.collections.count', []);

  mutableList.data.forEach((d) => {
    d.collections = get(
      collectionCounts.find((c) => c.key === d.name),
      'count',
      0
    );
  });

  const bulkActions = [
    {
      Component: (
        <Link
          className="button button--green button--add button--small form-group__element"
          to={{
            pathname: '/providers/add',
            search: getPersistentQueryParams(location),
          }}
        >
          Add Provider
        </Link>
      ),
    },
  ];

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
          list={mutableList}
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
  urlHelper: PropTypes.shape({
    location: PropTypes.object,
    queryParams: PropTypes.object,
    getPersistentQueryParams: PropTypes.func
  }),
};

export default withUrlHelper(ProvidersOverview);
