// This is the main Collections Overview page
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { get } from 'object-path';

import {
  applyRecoveryWorkflowToCollection,
  clearCollectionsSearch,
  getCumulusInstanceMetadata,
  getOptionsProviderName,
  listCollections,
  searchCollections,
  filterCollections,
  clearCollectionsFilter,
} from '../../actions';
import { lastUpdated, tally, getCollectionId } from '../../utils/format';
import {
  bulkActions,
  recoverAction,
  tableColumns,
} from '../../utils/table-config/collections';
import Dropdown from '../DropDown/dropdown';
import Search from '../Search/search';
import List from '../Table/Table';
import { strings } from '../locale';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import ListFilters from '../ListActions/ListFilters';
import { withUrlHelper } from '../../withUrlHelper';

const breadcrumbConfig = [
  {
    label: 'Dashboard Home',
    href: '/',
  },
  {
    label: 'Collections',
    active: true,
  },
];

const CollectionList = ({ urlHelper }) => {
  const dispatch = useDispatch();
  const { queryParams } = urlHelper;

  const collections = useSelector((state) => state.collections);
  const config = useSelector((state) => state.config);
  const datepicker = useSelector((state) => state.datepicker);
  const providers = useSelector((state) => state.providers);

  const { dropdowns } = providers;
  const { list } = collections;
  const { startDateTime, endDateTime } = datepicker || {};
  const hasTimeFilter = startDateTime || endDateTime;

  const { count, queriedAt } = list.meta;

  useEffect(() => {
    dispatch(getCumulusInstanceMetadata());
  }, [dispatch]);

  function generateQuery() {
    return { ...queryParams };
  }

  function generateBulkActions() {
    const actionConfig = {
      recover: {
        action: applyRecoveryWorkflowToCollection,
      },
    };
    let actions = bulkActions(collections);
    if (config.enableRecovery) {
      actions = actions.concat(recoverAction(collections, actionConfig));
    }
    return actions;
  }

  return (
    <div className="page__component">
      <Helmet>
        <title> Collections </title>
      </Helmet>
      <section className="page__section">
        <section className="page__section page__section__controls">
          <Breadcrumbs config={breadcrumbConfig} />
        </section>
        <div className="page__section__header page__section__header-wrapper">
          <h1 className="heading--large heading--shared-content with-description">
            {strings.collection_overview}
          </h1>
          {lastUpdated(queriedAt)}
        </div>
      </section>
      <section className="page__section">
        <div className="heading__wrapper--border">
          <h2 className="heading--medium heading--shared-content with-description">
            {hasTimeFilter
              ? strings.active_collections
              : strings.all_collections}
            <span className="num-title">{count ? tally(count) : 0}</span>
          </h2>
        </div>

        <List
          list={list}
          tableColumns={tableColumns}
          action={listCollections}
          query={generateQuery()}
          bulkActions={generateBulkActions()}
          rowId={getCollectionId}
          initialSortId="updatedAt"
          filterAction={filterCollections}
          filterClear={clearCollectionsFilter}
          tableId="collections"
        >
          <Search
            action={searchCollections}
            clear={clearCollectionsSearch}
            label="Search"
            labelKey="name"
            placeholder="Collection Name"
            searchKey="collections"
          />
          <ListFilters>
            <Dropdown
              getOptions={getOptionsProviderName}
              options={get(dropdowns, ['provider', 'options'])}
              action={filterCollections}
              clear={clearCollectionsFilter}
              paramKey="provider"
              label="Provider"
              inputProps={{
                placeholder: 'All',
                className: 'dropdown--medium',
              }}
            />
          </ListFilters>
        </List>
      </section>
    </div>
  );
};

CollectionList.propTypes = {
  collections: PropTypes.object,
  config: PropTypes.object,
  datepicker: PropTypes.object,
  // dispatch: PropTypes.func,
  providers: PropTypes.object,
  // queryParams: PropTypes.object,
  urlHelper: PropTypes.shape({
    queryParams: PropTypes.object
  }),
};

export { CollectionList };

export default withUrlHelper(CollectionList);
