'use strict';
import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  listCollections,
  searchCollections,
  clearCollectionsSearch
} from '../../actions';
import {
  collectionSearchResult,
  lastUpdated,
  tally,
  getCollectionId
} from '../../utils/format';
import {
  tableHeader,
  tableRow,
  tableSortProps,
  bulkActions
} from '../../utils/table-config/collections';
import Search from '../form/search';
import List from '../table/list-view';
import { strings } from '../locale';

var CollectionList = React.createClass({
  displayName: 'CollectionList',

  propTypes: {
    collections: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    logs: React.PropTypes.object
  },

  timeOptions: {
    '': '',
    '1 Week Ago': moment().subtract(1, 'weeks').format(),
    '1 Month Ago': moment().subtract(1, 'months').format(),
    '1 Year Ago': moment().subtract(1, 'years').format()
  },

  generateQuery: function () {
    return {};
  },

  generateBulkActions: function () {
    return bulkActions(this.props.collections);
  },

  render: function () {
    const { list } = this.props.collections;
    const { count, queriedAt } = list.meta;
    return (
      <div className='page__component'>
        <section className='page__section'>
          <div className='page__section__header page__section__header-wrapper'>
            <h1 className='heading--large heading--shared-content with-description'>{strings.collection_overview}</h1>
            {lastUpdated(queriedAt)}
          </div>
        </section>
        <section className='page__section'>
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium heading--shared-content with-description'>{strings.all_collections} <span className='num--title'>{count ? ` (${tally(count)})` : null}</span></h2>
          </div>
          <div className='filters'>
            <Search dispatch={this.props.dispatch}
              action={searchCollections}
              format={collectionSearchResult}
              clear={clearCollectionsSearch}
            />
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
});

export default connect(state => state)(CollectionList);
