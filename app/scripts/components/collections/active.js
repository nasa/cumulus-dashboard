'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { listCollections, searchCollections, clearCollectionsSearch } from '../../actions';
import { collectionSearchResult, lastUpdated } from '../../utils/format';
import { tableHeader, tableRow, tableSortProps } from '../../utils/table-config/collections';
import Search from '../form/search';
import List from '../table/list-view';
import { Link } from 'react-router';

var ActiveCollections = React.createClass({
  displayName: 'ActiveCollections',

  propTypes: {
    collections: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    logs: React.PropTypes.object
  },

  generateQuery: function () {
    return {};
  },

  render: function () {
    const { list, search } = this.props.collections;
    const { count, queriedAt } = list.meta;
    return (
      <div className='page__component'>
        <section className='page__section'>
          <div className='page__section__header'>
            <h1 className='heading--large heading--shared-content'>
              Active Collections <span style={{color: 'gray'}}>{ count ? `(${count})` : null }</span>
            </h1>
            <Link className='button button--green button--small form-group__element--right' to=''>Edit</Link>
            {lastUpdated(queriedAt)}
          </div>
          <div className='filters'>
            <div className='dropdown__wrapper form-group__element'>
              <select>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="year">Last Year</option>
              </select>
            </div>
            <div className='dropdown__wrapper form-group__element'>
              <select>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="year">Last Year</option>
              </select>
            </div>
            <Search dispatch={this.props.dispatch}
              action={searchCollections}
              results={search}
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
            isRemovable={true}
            rowId={'collectionName'}
          />
        </section>
      </div>
    );
  }
});

export default connect(state => state)(ActiveCollections);
