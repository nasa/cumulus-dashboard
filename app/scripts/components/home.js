'use strict';
import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { get } from 'object-path';
import { getStats, getCount, listPdrs } from '../actions';
import { nullValue, tally, seconds } from '../utils/format';
import LoadingEllipsis from './app/loading-ellipsis';
import List from './table/list-view';
import { tableHeader, tableRow, tableSortProps } from '../utils/table-config/pdrs';

const timespan = moment().subtract(1, 'day').format();

var Home = React.createClass({
  displayName: 'Home',

  propTypes: {
    dispatch: React.PropTypes.func,
    stats: React.PropTypes.object,
    granules: React.PropTypes.object,
    pdrs: React.PropTypes.object
  },

  componentWillMount: function () {
    this.queryStats();
  },

  queryStats: function () {
    this.props.dispatch(getStats({
      timestamp__from: timespan
    }));
    this.props.dispatch(getCount({
      type: 'granules',
      field: 'status'
    }));
  },

  generateQuery: function () {
    return {
      limit: 15
    };
  },

  renderGranuleProgress: function () {
    const { count } = this.props.stats;
    const granuleCount = get(count.data, 'granules.count', []);
    return (
      <ul className='timeline--processing--overall'>
        {granuleCount.map(d => (
          <li key={d.key} className={'timeline--processing--' + d.key}>
            <span className='num--medium'>{tally(d.count)}</span>
            Granules {d.key}
          </li>
        ))}
      </ul>
    );
  },

  render: function () {
    const { list } = this.props.pdrs;
    const { stats, count } = this.props.stats;
    const storage = get(stats.data, 'storage.value');
    const overview = [
      [tally(get(stats.data, 'errors.value', nullValue)), 'Errors', '/logs'],
      [tally(get(stats.data, 'collections.value', nullValue)), 'Collections', '/collections'],
      [tally(get(stats.data, 'granules.value', nullValue)), 'Granules (received today)', '/granules'],
      [seconds(get(stats.data, 'processingTime.value', nullValue)), 'Average Processing Time'],
      [(storage ? tally(storage) + get(stats.data, 'storage.unit') : nullValue), 'Data Used'],
      [tally(get(stats.data, 'queues.value', nullValue)), 'SQS Queues'],
      [tally(get(stats.data, 'ec2.value', nullValue)), 'EC2 Instances']
    ];
    const granuleCount = get(count.data, 'granules.meta.count');
    const numGranules = granuleCount ? `(${granuleCount})` : null;
    return (
      <div className='page__home'>
        <div className='content__header content__header--lg'>
          <div className='row'>
            <h1 className='heading--xlarge'>Dashboard</h1>
          </div>
        </div>
        <div className='page__content page__content__nosidebar'>
          <section className='page__section'>
            <div className='row'>
              <ul>
                {overview.map(d => (
                  <li key={d[1]}>
                    <Link className='overview-num' to={d[2] || '#'}><span className='num--large'>{ stats.inflight ? <LoadingEllipsis /> : d[0] }</span> {d[1]}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
          <section className='page__section'>
            <div className='row'>
              <div className='heading__wrapper--border'>
                <h2 className='heading--medium'>Granules Updated Today {numGranules}</h2>
              </div>
              {this.renderGranuleProgress()}
            </div>

            <div className='row'>
              <div className='heading__wrapper--border'>
                <h2 className='heading--medium'>Recently Active PDR's</h2>
              </div>
              <List
                list={list}
                dispatch={this.props.dispatch}
                action={listPdrs}
                tableHeader={tableHeader}
                primaryIdx={1}
                tableRow={tableRow}
                tableSortProps={tableSortProps}
                query={this.generateQuery()}
              />
              <Link className='link--secondary' to='/pdrs'>View All PDRs</Link>
            </div>
          </section>
          <section className='page__section'>
            <div className='row'>
              <div className='heading__wrapper--border'>
                <h2 className='heading--medium heading--shared-content'>Overview</h2>
                <div className='dropdown__wrapper form-group__element--right form-group__element--right--sm form-group__element--small'>
                  <select>
                    <option value="week">Last Week</option>
                    <option value="month">Last Month</option>
                    <option value="year">Last Year</option>
                  </select>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
});

export default connect(state => state)(Home);
