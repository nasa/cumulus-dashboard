'use strict';

import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { get } from 'object-path';
import { listProviders, getCount, interval } from '../../actions';
import { lastUpdated, tally, displayCase } from '../../utils/format';
import { tableHeader, tableRow, tableSortProps, bulkActions } from '../../utils/table-config/providers';
import List from '../table/list-view';
import Overview from '../app/overview';
import { updateInterval } from '../../config';

var ProvidersOverview = React.createClass({
  displayName: 'ProvidersOverview',

  propTypes: {
    dispatch: React.PropTypes.func,
    providers: React.PropTypes.object,
    stats: React.PropTypes.object
  },

  componentWillMount: function () {
    this.cancelInterval = interval(this.queryStats, updateInterval, true);
  },

  componentWillUnmount: function () {
    if (this.cancelInterval) { this.cancelInterval(); }
  },

  queryStats: function () {
    this.props.dispatch(getCount({
      type: 'collections',
      field: 'providers'
    }));
    this.props.dispatch(getCount({
      type: 'providers',
      field: 'status'
    }));
  },

  generateBulkActions: function () {
    const { providers } = this.props;
    return bulkActions(providers);
  },

  generateQuery: function () {
    return {
      limit: 10,
      status: 'ingesting'
    };
  },

  renderOverview: function (count) {
    const overview = count.map(d => [tally(d.count), displayCase(d.key)]);
    return <Overview items={overview} inflight={false} />;
  },

  render: function () {
    const { list } = this.props.providers;
    const { stats } = this.props;
    const { count, queriedAt } = list.meta;

    // Incorporate the collection counts into the `list`
    const collectionCounts = get(stats.count, 'data.collections.count', []);
    list.data.forEach(d => {
      d.collections = get(collectionCounts.find(c => c.key === d.name), 'count', 0);
    });
    const providerStatus = get(stats.count, 'data.providers.count', []);
    const overview = this.renderOverview(providerStatus);
    return (
      <div className='page__component'>
        <section className='page__section page__section__header-wrapper'>
          <h1 className='heading--large heading--shared-content with-description'>Providers Overview</h1>
          {lastUpdated(queriedAt)}
          {overview}
        </section>
        <section className='page__section'>
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium heading--shared-content'>Ingesting Providers <span className='num--title'>{count ? ` (${count})` : null}</span></h2>
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

        <Link to='/providers/active'>View All Active Providers</Link>
      </div>
    );
  }
});

export default connect(state => state)(ProvidersOverview);
