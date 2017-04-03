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
import { Link } from 'react-router';
import protocol from '../../utils/protocol';

var ListProviders = React.createClass({
  displayName: 'ListProviders',

  propTypes: {
    dispatch: React.PropTypes.func,
    providers: React.PropTypes.object,
    stats: React.PropTypes.object,
    location: React.PropTypes.object
  },

  isActive: function () {
    return this.props.location.pathname === '/providers/active';
  },

  componentWillMount: function () {
    this.props.dispatch(getCount({
      type: 'collections',
      field: 'providers'
    }));
  },

  generateQuery: function () {
    return {
      isActive: this.isActive()
    };
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
              {this.isActive() ? 'Active' : 'Inactive'} Providers <span style={{color: 'gray'}}>{ count ? `(${count})` : null }</span>
            </h1>
            <Link className='button button--green button--small form-group__element--right' to=''>Edit</Link>
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
            query={this.generateQuery()}
            bulkActions={this.generateBulkActions()}
            rowId={'name'}
          />
        </section>
      </div>
    );
  }
});

export default connect(state => state)(ListProviders);
