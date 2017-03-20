'use strict';

import React from 'react';
import { connect } from 'react-redux';
import {
  listProviders,
  searchProviders,
  clearProvidersSearch,
  filterProviders,
  clearProvidersFilter
} from '../../actions';
import { lastUpdated } from '../../utils/format';
import { tableHeader, tableRow, tableSortProps } from '../../utils/table-config/providers';
import List from '../table/list-view';
import Search from '../form/search';
import Dropdown from '../form/dropdown';
import { Link } from 'react-router';

import Overview from '../app/overview';

var InactiveProviders = React.createClass({
  displayName: 'InactiveProviders',

  propTypes: {
    dispatch: React.PropTypes.func,
    providers: React.PropTypes.object
  },

  generateQuery: function () {
    return {
      isActive: false
    };
  },

  render: function () {
    const { list } = this.props.providers;
    const { count, queriedAt } = list.meta;

    return (
      <div className='page__component'>
        <section className='page__section'>
          <div className='page__section__header'>
            <h1 className='heading--large heading--shared-content'>
              Inactive Providers <span style={{color: 'gray'}}>{ count ? `(${count})` : null }</span>
            </h1>
            <Link className='button button--green button--small form-group__element--right' to=''>Edit</Link>
            {lastUpdated(queriedAt)}
          </div>

          <div className='filters'>
            <Search dispatch={this.props.dispatch}
              action={searchProviders}
              clear={clearProvidersSearch}
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
          />
        </section>
      </div>
    );
  }
});

export default connect(state => state)(InactiveProviders);
