'use strict';
import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  listCollections,
  searchCollections,
  clearCollectionsSearch,
  filterCollections,
  clearCollectionsFilter
} from '../../actions';
import { collectionSearchResult, lastUpdated } from '../../utils/format';
import { tableHeader, tableRow, tableSortProps, bulkActions } from '../../utils/table-config/collections';
import Search from '../form/search';
import Dropdown from '../form/dropdown';
import List from '../table/list-view';
import { recent } from '../../config';

var CollectionList = React.createClass({
  displayName: 'CollectionList',

  propTypes: {
    location: React.PropTypes.object,
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
    const query = {};
    if (this.inactive()) query.updatedAt__to = recent;
    else query.updatedAt__from = recent;
    return query;
  },

  generateBulkActions: function () {
    return bulkActions(this.props.collections);
  },

  inactive: function () {
    return this.props.location.pathname.indexOf('collections/inactive') >= 0;
  },

  render: function () {
    const { list } = this.props.collections;
    const { count, queriedAt } = list.meta;
    return (
      <div className='page__component'>
        <section className='page__section'>
          <div className='page__section__header'>
            <h1 className='heading--large heading--shared-content with-description'>
              {this.inactive() ? 'Inactive' : 'Active'} Collections <span style={{color: 'gray'}}>{ !isNaN(count) ? `(${count})` : null }</span>
            </h1>
            {lastUpdated(queriedAt)}
          </div>
          <div className='filters'>
            <Dropdown
              dispatch={this.props.dispatch}
              options={this.timeOptions}
              action={filterCollections}
              clear={clearCollectionsFilter}
              paramKey={'createdAt__from'}
              label={'Starting'}
            />
            <Dropdown
              dispatch={this.props.dispatch}
              options={this.timeOptions}
              action={filterCollections}
              clear={clearCollectionsFilter}
              paramKey={'createdAt__to'}
              label={'Ending'}
            />
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
            isRemovable={true}
            rowId={'collectionName'}
          />
        </section>
      </div>
    );
  }
});

export default connect(state => state)(CollectionList);
