'use strict';

import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { get } from 'object-path';
import { listProviders, getCount, interval } from '../../actions';
import { lastUpdated, tally, displayCase } from '../../utils/format';
import { tableColumns } from '../../utils/table-config/providers';
import List from '../Table/Table';
import PropTypes from 'prop-types';
import Overview from '../Overview/overview';
import _config from '../../config';

const { updateInterval } = _config;

class ProvidersOverview extends React.Component {
  constructor () {
    super();
    this.displayName = 'ProvidersOverview';
    this.queryStats = this.queryStats.bind(this);
    this.generateQuery = this.generateQuery.bind(this);
    this.renderOverview = this.renderOverview.bind(this);
  }

  componentDidMount () {
    this.cancelInterval = interval(this.queryStats, updateInterval, true);
  }

  componentWillUnmount () {
    if (this.cancelInterval) { this.cancelInterval(); }
  }

  queryStats () {
    this.props.dispatch(getCount({
      type: 'collections',
      field: 'providers'
    }));
    this.props.dispatch(getCount({
      type: 'providers',
      field: 'status'
    }));
  }

  generateQuery () {
    return {};
  }

  renderOverview (count) {
    const overview = count.map(d => [tally(d.count), displayCase(d.key)]);
    return <Overview items={overview} inflight={false} />;
  }

  render () {
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
          <h1 className='heading--large heading--shared-content with-description'>Provider Overview</h1>
          {lastUpdated(queriedAt)}
          {overview}
        </section>
        <section className='page__section'>
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium heading--shared-content'>Ingesting Providers <span className='num--title'>{count ? `${count}` : 0}</span></h2>
          </div>

          <List
            list={list}
            dispatch={this.props.dispatch}
            action={listProviders}
            tableColumns={tableColumns}
            query={this.generateQuery()}
            bulkActions={[]}
            rowId='name'
            sortIdx='timestamp'
          />
        </section>
      </div>
    );
  }
}

ProvidersOverview.propTypes = {
  dispatch: PropTypes.func,
  providers: PropTypes.object,
  stats: PropTypes.object
};

export default withRouter(connect(state => state)(ProvidersOverview));
