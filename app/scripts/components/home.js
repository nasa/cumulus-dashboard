'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { get } from 'object-path';
import {
  interval,
  getStats,
  getCount,
  listGranules,
  getResources,
  getRecentGranules
} from '../actions';
import { nullValue, tally } from '../utils/format';
import LoadingEllipsis from './app/loading-ellipsis';
import List from './table/list-view';
import GranulesProgress from './granules/progress';
import {
  tableHeader,
  tableRow,
  tableSortProps
} from '../utils/table-config/granules';
import { recent, updateInterval } from '../config';

var Home = React.createClass({
  displayName: 'Home',
  propTypes: {
    dispatch: React.PropTypes.func,
    stats: React.PropTypes.object,
    granules: React.PropTypes.object,
    pdrs: React.PropTypes.object
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
    dispatch(getResources());
    dispatch(getStats({
      timestamp__from: recent
    }));
    dispatch(getCount({
      type: 'granules',
      field: 'status'
    }));
    dispatch(getRecentGranules());
  },

  generateQuery: function () {
    return {
      timestamp__from: recent,
      limit: 30
    };
  },

  render: function () {
    const { list, recent } = this.props.granules;
    const { stats, count } = this.props.stats;
    const overview = [
      [tally(get(stats.data, 'errors.value')), 'Errors', '/logs'],
      [tally(get(stats.data, 'collections.value')), 'Collections', '/collections'],
      [tally(get(recent, 'data.count')), 'Granules Processed in the Past Hour', '/granules']
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
                <span className='metadata__updated'>Jan. 20, 2017</span>
              </div>
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
                <h2 className='heading--medium heading--shared-content--right'>Granules Updated <span className='num--title'>{numGranules}</span></h2>
                <span className='metadata__updated'>Jan. 20, 2017</span>
              </div>
              <GranulesProgress granules={granuleStatus} />
            </div>
          </section>
          <section className='page__section'>
            <div className='row'>
              <div className='heading__wrapper--border'>
                <h2 className='heading--medium heading--shared-content--right'>Errors <span className='num--title'>(8)</span></h2>
                <span className='metadata__updated'>Jan. 20, 2017</span>
              </div>
              
              {/*<div className='heading__wrapper--border'>
                <h2 className='heading--medium'>Recently Active Granules's</h2>
              </div>
              <List
                list={list}
                dispatch={this.props.dispatch}
                action={listGranules}
                tableHeader={tableHeader}
                sortIdx={6}
                tableRow={tableRow}
                tableSortProps={tableSortProps}
                query={this.generateQuery()}
              />
              <Link className='link--secondary link--learn-more' to='/granules'>View Granules Overview</Link>*/}
            </div>
          </section>
        </div>
      </div>
    );
  }
});

export default connect(state => state)(Home);
