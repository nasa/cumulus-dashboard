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
  deleteProvider,
  getCount
} from '../../actions';
import { get } from 'object-path';
import { dropdownOption, lastUpdated } from '../../utils/format';
import { tableHeader, tableRow, tableSortProps } from '../../utils/table-config/providers';
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

  getInitialState: function () {
    return {
      listTitle: '',
      query: {}
    };
  },

  setViewState: function () {
    switch (this.props.location.pathname) {
      case '/providers/active':
        this.setState({
          listTitle: 'Active Providers',
          query: {isActive: true}
        });
        break;
      case '/providers/inactive':
        this.setState({
          listTitle: 'Inactive Providers',
          query: {isActive: false}
        });
        break;
      case '/providers/failed':
        this.setState({
          listTitle: 'Failed Providers',
          query: {status: 'failed'}
        });
        break;
    }
  },

  componentWillMount: function () {
    this.props.dispatch(getCount({
      type: 'collections',
      field: 'providers'
    }));
    this.setViewState();
  },

  componentWillReceiveProps: function () {
    // Needed in case a user navigates directly from
    // `/providers/active` to `/providers/inactive`, for example
    this.setViewState();
  },

  generateBulkActions: function () {
    const { providers } = this.props;
    return [
      {
        text: 'Delete',
        action: deleteProvider,
        state: providers.deleted
      }
    ];
  },

  render: function () {
    const { list, dropdowns } = this.props.providers;
    const { count, queriedAt } = list.meta;

    // Incorporate the collection counts into the `list`
    const collectionCounts = get(this.props.stats, ['count', 'data', 'collections', 'count'], []);
    list.data.forEach(d => {
      d.collections = get(collectionCounts.find(c => c.key === d.name), 'count', 0);
    });

    return (
      <div className='page__component'>
        <section className='page__section'>
          <div className='page__section__header'>
            <h1 className='heading--large heading--shared-content'>
              {this.state.listTitle} <span style={{color: 'gray'}}>{ !isNaN(count) ? `(${count})` : null }</span>
            </h1>
            {lastUpdated(queriedAt)}
          </div>

          <div className='filters filters__wlabels'>
            <Search dispatch={this.props.dispatch}
              action={searchProviders}
              clear={clearProvidersSearch}
            />
            <Dropdown
              dispatch={this.props.dispatch}
              getOptions={getOptionsProviderGroup}
              options={get(dropdowns, ['group', 'options'])}
              format={dropdownOption}
              action={filterProviders}
              clear={clearProvidersFilter}
              paramKey={'providerName'}
              label={'Group'}
            />
            <Dropdown
              dispatch={this.props.dispatch}
              options={protocol}
              format={dropdownOption}
              action={filterProviders}
              clear={clearProvidersFilter}
              paramKey={'protocol'}
              label={'Protocol'}
            />
          </div>

          <List
            list={list}
            dispatch={this.props.dispatch}
            action={listProviders}
            tableHeader={tableHeader}
            tableRow={tableRow}
            tableSortProps={tableSortProps}
            query={this.state.query}
            bulkActions={this.generateBulkActions()}
            rowId={'name'}
          />
        </section>
      </div>
    );
  }
});

export default connect(state => state)(ListProviders);
