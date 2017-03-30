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
  deleteProvider
} from '../../actions';
import { get } from 'object-path';
import { dropdownOption, lastUpdated } from '../../utils/format';
import { tableHeader, tableRow, tableSortProps } from '../../utils/table-config/providers';
import List from '../table/list-view';
import Search from '../form/search';
import Dropdown from '../form/dropdown';
import { Link } from 'react-router';
import protocol from '../../utils/protocol';

var ActiveProviders = React.createClass({
  displayName: 'ActiveProviders',

  propTypes: {
    dispatch: React.PropTypes.func,
    providers: React.PropTypes.object
  },

  generateQuery: function () {
    return {
      isActive: true
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

    return (
      <div className='page__component'>
        <section className='page__section'>
          <div className='page__section__header'>
            <h1 className='heading--large heading--shared-content'>
              Active Providers <span style={{color: 'gray'}}>{ count ? `(${count})` : null }</span>
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

export default connect(state => state)(ActiveProviders);
