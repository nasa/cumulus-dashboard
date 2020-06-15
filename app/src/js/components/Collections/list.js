// This is the main Collections Overview page
'use strict';
import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  applyRecoveryWorkflowToCollection,
  clearCollectionsSearch,
  getCumulusInstanceMetadata,
  listCollections,
  searchCollections,
  filterCollections,
  clearCollectionsFilter,
} from '../../actions';
import {
  collectionSearchResult,
  lastUpdated,
  tally,
  getCollectionId,
} from '../../utils/format';
import {
  bulkActions,
  recoverAction,
  tableColumns,
} from '../../utils/table-config/collections';
import Search from '../Search/search';
import List from '../Table/Table';
import { strings } from '../locale';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import ListFilters from '../ListActions/ListFilters';
import Dropdown from '../DropDown/dropdown';
import pageSizeOptions from '../../utils/page-size';

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

class CollectionList extends React.Component {
  constructor() {
    super();
    this.generateQuery = this.generateQuery.bind(this);
    this.generateBulkActions = this.generateBulkActions.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(getCumulusInstanceMetadata());
  }

  generateQuery() {
    return {};
  }

  generateBulkActions() {
    const actionConfig = {
      recover: {
        action: applyRecoveryWorkflowToCollection,
      },
    };
    const { collections, config } = this.props;
    let actions = bulkActions(collections);
    if (config.enableRecovery) {
      actions = actions.concat(recoverAction(collections, actionConfig));
    }
    return actions;
  }

  render() {
    const { collections, mmtLinks, datepicker } = this.props;
    const { list } = collections;
    const { startDateTime, endDateTime } = datepicker || {};
    const hasTimeFilter = startDateTime || endDateTime;

    // merge mmtLinks with the collection data;
    const data = list.data.map((collection) => {
      return {
        ...collection,
        mmtLink: mmtLinks[getCollectionId(collection)],
      };
    });
    const { count, queriedAt } = list.meta;
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
            data={data}
            tableColumns={tableColumns}
            dispatch={this.props.dispatch}
            action={listCollections}
            query={this.generateQuery()}
            bulkActions={this.generateBulkActions()}
            rowId={getCollectionId}
            sortId="duration"
          >
            <ListFilters>
              <Search
                dispatch={this.props.dispatch}
                action={searchCollections}
                format={collectionSearchResult}
                clear={clearCollectionsSearch}
                label="Search"
                placeholder="Collection Name"
              />

              <Dropdown
                options={pageSizeOptions}
                action={filterCollections}
                clear={clearCollectionsFilter}
                paramKey={'limit'}
                label={'Results Per Page'}
                inputProps={{
                  placeholder: 'Results Per Page',
                }}
              />
            </ListFilters>
          </List>
        </section>
      </div>
    );
  }
}

CollectionList.propTypes = {
  collections: PropTypes.object,
  mmtLinks: PropTypes.object,
  dispatch: PropTypes.func,
  config: PropTypes.object,
  datepicker: PropTypes.object,
};

CollectionList.displayName = 'CollectionList';

export { CollectionList };
export default withRouter(
  connect((state) => ({
    config: state.config,
    collections: state.collections,
    datepicker: state.datepicker,
    mmtLinks: state.mmtLinks,
  }))(CollectionList)
);
