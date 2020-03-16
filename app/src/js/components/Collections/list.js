// This is the main Collections Overview page
'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import {
  applyRecoveryWorkflowToCollection,
  clearCollectionsSearch,
  getCumulusInstanceMetadata,
  listCollections,
  searchCollections
} from '../../actions';
import {
  collectionSearchResult,
  lastUpdated,
  tally,
  getCollectionId
} from '../../utils/format';
import {
  bulkActions,
  recoverAction,
  tableColumns
} from '../../utils/table-config/collections';
import Search from '../Search/search';
import List from '../Table/Table';
import { strings } from '../locale';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import ListFilters from '../ListActions/ListFilters';

const breadcrumbConfig = [
  {
    label: 'Dashboard Home',
    href: '/'
  },
  {
    label: 'Collections',
    active: true
  }
];

class CollectionList extends React.Component {
  constructor () {
    super();
    this.displayName = 'CollectionList';
    this.timeOptions = {
      '': '',
      '1 Week Ago': moment().subtract(1, 'weeks').format(),
      '1 Month Ago': moment().subtract(1, 'months').format(),
      '1 Year Ago': moment().subtract(1, 'years').format()
    };
    this.generateQuery = this.generateQuery.bind(this);
    this.generateBulkActions = this.generateBulkActions.bind(this);
  }

  componentDidMount () {
    const { dispatch } = this.props;
    dispatch(getCumulusInstanceMetadata());
  }

  generateQuery () {
    return {};
  }

  generateBulkActions () {
    const actionConfig = {
      recover: {
        action: applyRecoveryWorkflowToCollection
      }
    };
    const { collections, config } = this.props;
    let actions = bulkActions(collections);
    if (config.enableRecovery) actions = actions.concat(recoverAction(collections, actionConfig));
    return actions;
  }

  render () {
    const { list } = this.props.collections;
    // merge mmtLinks with the collection data;
    const mmtLinks = this.props.mmtLinks;
    const data = list.data.map((collection) => {
      return {
        ...collection,
        mmtLink: mmtLinks[getCollectionId(collection)]
      };
    });
    const { count, queriedAt } = list.meta;
    return (
      <div className='page__component'>
        <section className='page__section'>
          <section className='page__section page__section__controls'>
            <Breadcrumbs config={breadcrumbConfig} />
          </section>
          <div className='page__section__header page__section__header-wrapper'>
            <h1 className='heading--large heading--shared-content with-description'>{strings.collection_overview}</h1>
            {lastUpdated(queriedAt)}
          </div>
        </section>
        <section className='page__section'>
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium heading--shared-content with-description'>{strings.all_collections} <span className='num--title'>{count ? ` ${tally(count)}` : 0}</span></h2>
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
            sortIdx='duration'
          >
            <ListFilters>
              <Search
                dispatch={this.props.dispatch}
                action={searchCollections}
                format={collectionSearchResult}
                clear={clearCollectionsSearch}
                placeholder='Search Collections'
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
  logs: PropTypes.object,
  config: PropTypes.object,
  location: PropTypes.object
};

export { CollectionList };
export default withRouter(connect(state => state)(CollectionList));
