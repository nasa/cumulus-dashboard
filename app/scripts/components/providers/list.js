'use strict';

import React from 'react';
import { connect } from 'react-redux';
import {
  listProviders,
  searchProviders,
  clearProvidersSearch,
  getOptionsProviderGroup,
  filterProviders,
  clearProvidersFilter,
  getAggregate
} from '../../actions';
import { get } from 'object-path';
import { lastUpdated, displayCase } from '../../utils/format';
import {
  tableHeader,
  tableRow,
  tableSortProps,
  errorTableHeader,
  errorTableRow,
  errorTableSortProps,
  bulkActions
} from '../../utils/table-config/providers';
import List from '../table/list-view';
import Search from '../form/search';
import Dropdown from '../form/dropdown';
import protocol from '../../utils/protocol';

var ListProviders = React.createClass({
  displayName: 'ListProviders',

  propTypes: {
    dispatch: React.PropTypes.func,
    providers: React.PropTypes.object,
    stats: React.PropTypes.object,
    location: React.PropTypes.object
  },

  getViewState: function () {
    let state;
    switch (this.props.location.pathname) {
      case '/providers/active':
        state = {
          title: 'active',
          query: {isActive: true}
        };
        break;
      case '/providers/inactive':
        state = {
          title: 'inactive',
          query: {isActive: false}
        };
        break;
      case '/providers/failed':
        state = {
          title: 'failed',
          query: {status: 'failed'}
        };
        break;
      case '/providers/all':
        state = {
          title: 'all',
          query: {}
        };
        break;
    }
    return state;
  },

  componentWillMount: function () {
    this.props.dispatch(getAggregate({
      type: 'collections',
      field: 'providers'
    }));
  },

  generateBulkActions: function () {
    const { providers } = this.props;
    return bulkActions(providers);
  },

  render: function () {
    const { list, dropdowns } = this.props.providers;
    const { count, queriedAt } = list.meta;
    const { title, query } = this.getViewState();

    // Incorporate the collection counts into the `list`
    const collectionCounts = get(this.props.stats, ['count', 'data', 'collections', 'count'], []);
    list.data.forEach(d => {
      d.collections = get(collectionCounts.find(c => c.key === d.name), 'count', 0);
    });

    return (
      <div className='page__component'>
        <section className='page__section page__section__header-wrapper'>
          <div className='page__section__header'>
            <h1 className='heading--large heading--shared-content with-description'>
              {displayCase(title)} Providers<span className='num--title'>{ !isNaN(count) ? `(${count})` : null }</span>
            </h1>
            {lastUpdated(queriedAt)}
          </div>

          <div className='filters filters__wlabels'>
            <Dropdown
              dispatch={this.props.dispatch}
              getOptions={getOptionsProviderGroup}
              options={get(dropdowns, ['group', 'options'])}
              action={filterProviders}
              clear={clearProvidersFilter}
              paramKey={'providerName'}
              label={'Group'}
            />
            <Dropdown
              dispatch={this.props.dispatch}
              options={protocol}
              action={filterProviders}
              clear={clearProvidersFilter}
              paramKey={'protocol'}
              label={'Protocol'}
            />
            <Search dispatch={this.props.dispatch}
              action={searchProviders}
              clear={clearProvidersSearch}
            />
          </div>

          <List
            list={list}
            dispatch={this.props.dispatch}
            action={listProviders}
            tableHeader={title === 'failed' ? errorTableHeader : tableHeader}
            tableRow={title === 'failed' ? errorTableRow : tableRow}
            tableSortProps={title === 'failed' ? errorTableSortProps : tableSortProps}
            query={query}
            bulkActions={this.generateBulkActions()}
            rowId={'name'}
          />
        </section>
      </div>
    );
  }
});

export default connect(state => state)(ListProviders);
