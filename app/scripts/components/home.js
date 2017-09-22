'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { get } from 'object-path';
import {
  interval,
  getStats,
  getCount,
  listGranules,
  listExecutions,
  listRules
} from '../actions';
import {
  nullValue,
  tally,
  seconds
} from '../utils/format';
import List from './table/list-view';
import GranulesProgress from './granules/progress';
import {
  errorTableHeader,
  errorTableRow,
  errorTableSortProps
} from '../utils/table-config/granules';
import { recent, updateInterval } from '../config';

var Home = React.createClass({
  displayName: 'Home',
  propTypes: {
    dispatch: PropTypes.func,
    stats: PropTypes.object,
    rules: PropTypes.object,
    granules: PropTypes.object,
    pdrs: PropTypes.object,
    executions: PropTypes.object
  },

  componentWillMount: function () {
    this.cancelInterval = interval(() => {
      this.query();
    }, updateInterval, true);
  },

  componentWillUnmount: function () {
    if (this.cancelInterval) { this.cancelInterval(); }
  },

  query: function () {
    const { dispatch } = this.props;
    // TODO should probably time clamp this by most recent as well?
    dispatch(getStats({
      timestamp__from: recent
    }));
    dispatch(getCount({
      type: 'granules',
      field: 'status'
    }));
    dispatch(listExecutions({}));
    dispatch(listRules({}));
  },

  generateQuery: function () {
    return {
      q: '_exists_:error AND status:failed',
      limit: 100
    };
  },

  render: function () {
    const { list } = this.props.granules;
    const { stats, count } = this.props.stats;
    const overview = [
      [tally(get(stats.data, 'errors.value')), 'Errors', '/logs'],
      [tally(get(stats.data, 'collections.value')), 'Collections', '/collections'],
      [tally(get(stats.data, 'granules.value')), 'Granules', '/granules'],
      [tally(get(this.props.executions, 'list.meta.count')), 'Executions', '/executions'],
      [tally(get(this.props.rules, 'list.meta.count')), 'Ingest Rules', '/rules'],
      [seconds(get(stats.data, 'processingTime.value', nullValue)), 'Average processing Time']
    ];
    const granuleCount = get(count.data, 'granules.meta.count');
    const numGranules = !isNaN(granuleCount) ? `(${tally(granuleCount)})` : null;
    const granuleStatus = get(count.data, 'granules.count', []);

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
              <div className='heading__wrapper--border'>
                <h2 className='heading--medium heading--shared-content--right'>Updates</h2>
              </div>
              <ul>
                {overview.map(d => {
                  const value = d[0];
                  if (value === nullValue) return null;
                  return (
                    <li key={d[1]}>
                      <Link className='overview-num' to={d[2] || '#'}>
                        <span className='num--large'>{value}</span> {d[1]}
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
                <h2 className='heading--medium heading--shared-content--right'>Granules Updated <span className='num--title'>{numGranules}</span></h2>
                <span className='metadata__updated'>Jan. 20, 2017</span>
              </div>
              <GranulesProgress granules={granuleStatus} />
            </div>
          </section>

          <section className='page__section list--granules'>
            <div className='row'>
              <div className='heading__wrapper--border'>
                <h2 className='heading--medium'>Granule Errors</h2>
              </div>
              <List
                list={list}
                dispatch={this.props.dispatch}
                action={listGranules}
                tableHeader={errorTableHeader}
                sortIdx={4}
                tableRow={errorTableRow}
                tableSortProps={errorTableSortProps}
                query={this.generateQuery()}
              />
              <Link className='link--secondary link--learn-more' to='/granules'>View Granules Overview</Link>
            </div>
          </section>
        </div>
      </div>
    );
  }
});

export default connect(state => ({
  rules: state.rules,
  stats: state.stats,
  granules: state.granules,
  pdrs: state.pdrs,
  executions: state.executions
}))(Home);
