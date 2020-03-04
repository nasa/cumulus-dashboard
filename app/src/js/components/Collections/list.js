// This is the main Collections Overview page
'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import moment from 'moment';
import {
  applyRecoveryWorkflowToCollection,
  clearCollectionsSearch,
  getCumulusInstanceMetadata,
  listCollections,
  searchCollections,
  deleteCollection
} from '../../actions';
import {
  collectionSearchResult,
  lastUpdated,
  tally,
  getCollectionId
} from '../../utils/format';
import { get } from 'object-path';
import {
  tableHeader,
  tableRow,
  tableSortProps,
  bulkActions,
  recoverAction
} from '../../utils/table-config/collections';
import Search from '../Search/search';
import List from '../Table/Table';
import { strings } from '../locale';
import DeleteCollection from '../DeleteCollection/DeleteCollection';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';

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

// const { pathname } = this.props.location;
// const existingCollection = pathname !== '/collections/add';

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
    [
      this.generateQuery,
      this.generateBulkActions,
      this.deleteMe,
      this.errors
    ].forEach((fn) => (this[fn.name] = fn.bind(this)));
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

  deleteMe () {
    const { name, version } = this.props.match.params;
    this.props.dispatch(deleteCollection(name, version));
  }

  errors () {
    const { name, version } = this.props.match.params;
    const collectionId = getCollectionId({name, version});
    return [
      get(this.props.collections.map, [collectionId, 'error']),
      get(this.props.collections.deleted, [collectionId, 'error'])
    ].filter(Boolean);
  }

  renderDeleteButton () {
    const { match: { params }, collections } = this.props;
    const collectionId = getCollectionId(params);
    const deleteStatus = get(collections.deleted, [collectionId, 'status']);
    const hasGranules = get(
      collections.map[collectionId], 'data.stats.total', 0) > 0;

    return (
      <DeleteCollection
        collectionId={collectionId}
        errors={this.errors()}
        hasGranules={hasGranules}
        onDelete={this.deleteMe}
        onGotoGranules={this.gotoGranules}
        onSuccess={this.navigateBack}
        status={deleteStatus}
      />
    );
  }

  render () {
    const { list } = this.props.collections;
    // merge mmtLinks with the collection data;
    const mmtLinks = this.props.mmtLinks;
    list.data.forEach((collection) => { collection.mmtLink = mmtLinks[getCollectionId(collection)]; });
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
          <div className='filters filters__wlabels'>
            <ul>
              <li>
                <Search dispatch={this.props.dispatch}
                  action={searchCollections}
                  format={collectionSearchResult}
                  clear={clearCollectionsSearch}
                />
              </li>
              <li>
                <Link className='button button--green button--small button--add' to='/collections/add'>{strings.add_a_collection}</Link>
              </li>
              <li>
                {this.renderDeleteButton()}
              </li>
            </ul>
          </div>

          <List
            list={list}
            dispatch={this.props.dispatch}
            action={listCollections}
            tableHeader={tableHeader}
            tableRow={tableRow}
            tableSortProps={tableSortProps}
            query={this.generateQuery()}
            bulkActions={this.generateBulkActions()}
            rowId={getCollectionId}
            sortIdx={7}
          />

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
  location: PropTypes.object,
  match: PropTypes.object
};

export { CollectionList };
export default withRouter(connect(state => state)(CollectionList));
