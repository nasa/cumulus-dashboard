'use strict';

import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { get } from 'object-path';
import { listProviders, getCount } from '../../actions';
import { lastUpdated } from '../../utils/format';
import { tableHeader, tableRow, tableSortProps } from '../../utils/table-config/providers';
import List from '../table/list-view';

var ProvidersOverview = React.createClass({
  displayName: 'ProvidersOverview',

  propTypes: {
    dispatch: React.PropTypes.func,
    providers: React.PropTypes.object,
    stats: React.PropTypes.object
  },

  componentWillMount: function () {
    this.props.dispatch(getCount({
      type: 'collections',
      field: 'providers'
    }));
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

    // Incorporate the collection counts into the `list`
    const collectionCounts = get(this.props.stats, ['count', 'data', 'collections', 'count'], []);
    list.data.forEach(d => {
      d.collections = get(collectionCounts.find(c => c.key === d.name), 'count', 0);
    });

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
            rowId={'name'}
          />
        </section>

        <Link to='/providers/active'>View All Active Providers</Link>
      </div>
    );
  }
});

export default connect(state => state)(ProvidersOverview);
