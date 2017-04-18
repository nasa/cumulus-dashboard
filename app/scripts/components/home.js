'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import moment from 'moment';
import { get } from 'object-path';
import {
  interval,
  getStats,
  getAggregate,
  listPdrs,
  getResources,
  queryHistogram,
  getRecentGranules
} from '../actions';
import { nullValue, tally, seconds } from '../utils/format';
import LoadingEllipsis from './app/loading-ellipsis';
import List from './table/list-view';
import Histogram from './chart/histogram';
import GranulesProgress from './granules/progress';
import { tableHeader, tableRow, tableSortProps } from '../utils/table-config/pdr-progress';
import serialize from '../utils/serialize-config';
import { recent, updateInterval } from '../config';

const spans = {
  week: moment().subtract(1, 'week').format(),
  month: moment().subtract(1, 'month').format(),
  year: moment().subtract(1, 'year').format()
};

const intervals = {
  week: 'day',
  month: 'week',
  year: 'month'
};

const tGranulesProcessed = (d) => `${tally(d)} Granule(s) Processed`;
const tErrors = (d) => `${tally(d)} Error(s) Recorded`;
const tPdrsProcessed = (d) => `${tally(d)} PDR(s) Processed`;
const tGranulesFailed = (d) => `${tally(d)} Granule(s) Failed`;

var Home = React.createClass({
  displayName: 'Home',

  getInitialState: function () {
    return {
      span: 'week'
    };
  },

  propTypes: {
    dispatch: React.PropTypes.func,
    stats: React.PropTypes.object,
    granules: React.PropTypes.object,
    pdrs: React.PropTypes.object
  },

  componentWillMount: function () {
    this.cancelInterval = interval(() => {
      this.query();
      this.queryHistogram();
    }, updateInterval, true);
  },

  componentWillUnmount: function () {
    if (this.cancelInterval) { this.cancelInterval(); }
  },

  query: function () {
    const { dispatch } = this.props;
    // TODO should probably time clamp this by most recent as well?
    dispatch(getResources());
    dispatch(getStats({
      timestamp__from: recent
    }));
    dispatch(getAggregate({
      type: 'granules',
      field: 'status'
    }));
    dispatch(getRecentGranules());
  },

  queryHistogram: function () {
    const { dispatch } = this.props;
    dispatch(queryHistogram(this.generateGranulesProcessed()));
    dispatch(queryHistogram(this.generateErrors()));
    dispatch(queryHistogram(this.generatePdrsProcessed()));
    dispatch(queryHistogram(this.generateGranulesFailed()));
  },

  changeSpan: function (e) {
    this.setState({ span: e.currentTarget.value }, this.queryHistogram);
  },

  generateGranulesProcessed: function () {
    return {
      type: 'granules',
      status: 'completed',
      interval: intervals[this.state.span],
      updatedAt__from: spans[this.state.span]
    };
  },

  generateErrors: function () {
    return {
      type: 'logs',
      level: 'error',
      interval: intervals[this.state.span],
      timestamp__from: spans[this.state.span]
    };
  },

  generatePdrsProcessed: function () {
    return {
      type: 'pdrs',
      status: 'completed',
      interval: intervals[this.state.span],
      updatedAt__from: spans[this.state.span]
    };
  },

  generateGranulesFailed: function () {
    return {
      type: 'granules',
      status: 'failed',
      interval: intervals[this.state.span],
      updatedAt__from: spans[this.state.span]
    };
  },

  generateQuery: function () {
    return {
      updatedAt__from: recent,
      limit: 10
    };
  },

  render: function () {
    const { list } = this.props.pdrs;
    const { recent } = this.props.granules;
    const { stats, aggregate, resources, histogram } = this.props.stats;
    const overview = [
      [tally(get(stats.data, 'errors.value')), 'Errors', '/logs'],
      [tally(get(stats.data, 'collections.value')), 'Collections', '/collections'],
      [tally(get(recent, 'data.count')), 'Granules Processed in the Past Hour', '/granules'],
      [seconds(get(stats.data, 'processingTime.value', nullValue)), 'Average Processing Time'],
      [tally(get(resources.data, 'tasks.pendingTasks')), 'Pending Tasks', '/resources'],
      [tally(get(resources.data, 'tasks.runningTasks')), 'Running Tasks', '/resources'],
      [tally(get(resources.data, 'queues', []).length || nullValue), 'Queued Messages', '/resources']
    ];
    const granuleCount = get(aggregate.data, 'granules.meta.count');
    const numGranules = !isNaN(granuleCount) ? `(${tally(granuleCount)})` : null;

    const granulesProcessed = get(histogram, serialize(this.generateGranulesProcessed()), {});
    const errorsRecorded = get(histogram, serialize(this.generateErrors()), {});
    const pdrsProcessed = get(histogram, serialize(this.generatePdrsProcessed()), {});
    const granulesFailed = get(histogram, serialize(this.generateGranulesFailed()), {});
    const granuleStatus = get(aggregate.data, 'granules.count', []);

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
                {overview.map(d => {
                  const value = d[0];
                  let useLoading = value === nullValue;
                  return (
                    <li key={d[1]}>
                      <Link className='overview-num' to={d[2] || '#'}>
                        <span className='num--large'>{ useLoading ? <LoadingEllipsis /> : value }</span> {d[1]}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
          <section className='page__section'>
            <div className='row'>
              <div className='heading__wrapper--border'>
                <h2 className='heading--medium'>Granules Updated Today <span className='num--title'>{numGranules}</span></h2>
              </div>
              <GranulesProgress granules={granuleStatus} />
            </div>
          </section>
          <section className='page__section'>
            <div className='row'>
              <div className='heading__wrapper--border'>
                <h2 className='heading--medium'>Recently Active PDR's</h2>
              </div>
              <List
                list={list}
                dispatch={this.props.dispatch}
                action={listPdrs}
                tableHeader={tableHeader}
                sortIdx={5}
                tableRow={tableRow}
                tableSortProps={tableSortProps}
                query={this.generateQuery()}
              />
              <Link className='link--secondary link--learn-more' to='/pdrs'>View PDR Overview</Link>
            </div>
          </section>
          <section className='page__section'>
            <div className='row'>
              <div className='heading__wrapper--border'>
                <h2 className='heading--medium heading--shared-content'>Overview</h2>
                <div className='dropdown__wrapper form-group__element--right form-group__element--right--sm form-group__element--small'>
                  <select onChange={this.changeSpan} value={this.state.span}>
                    <option value="week">Last Week</option>
                    <option value="month">Last Month</option>
                    <option value="year">Last Year</option>
                  </select>
                </div>
              </div>
              <div className='chart__box'>
                <h2 className='chart__title'>Granules Processed</h2>
                <Histogram data={granulesProcessed} tooltipFormat={tGranulesProcessed}/>
              </div>
              <div className='chart__box'>
                <h2 className='chart__title'>Errors Over Time</h2>
                <Histogram data={errorsRecorded} tooltipFormat={tErrors}/>
              </div>
              <div className='chart__box'>
                <h2 className='chart__title'>PDRs Processed</h2>
                <Histogram data={pdrsProcessed} tooltipFormat={tPdrsProcessed}/>
              </div>
              <div className='chart__box'>
                <h2 className='chart__title'>Granules Failed</h2>
                <Histogram data={granulesFailed} tooltipFormat={tGranulesFailed} />
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
});

export default connect(state => state)(Home);
