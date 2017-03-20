'use strict';

import React from 'react';
import { connect } from 'react-redux';
import { listProviders } from '../../actions';
import { lastUpdated } from '../../utils/format';
import { tableHeader, tableRow, tableSortProps } from '../../utils/table-config/providers';
import List from '../table/list-view';

import Overview from '../app/overview';

var ProvidersOverview = React.createClass({
  displayName: 'ProvidersOverview',

  propTypes: {
    dispatch: React.PropTypes.func,
    providers: React.PropTypes.object
  },

  generateQuery: function () {
    return {
      limit: 10,
      status: 'ingesting'
    };
  },

  render: function () {
    const { list } = this.props.providers;
    const { count, queriedAt } = list.meta;

    return (
      <div className='page__component'>
        <section className='page__section'>
          <h1 className='heading--large heading--shared-content'>Providers</h1>
          {lastUpdated(queriedAt)}
        </section>
        <section className='page__section'>
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium heading--shared-content'>Ingesting Providers{count ? ` (${count})` : null}</h2>
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

export default connect(state => state)(ProvidersOverview);
