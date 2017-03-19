'use strict';
import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { get } from 'object-path';
import { getStats, listGranules } from '../actions';
import { nullValue, tally, seconds, fullDate } from '../utils/format';
import SortableTable from './table/sortable';

const timespan = moment().subtract(1, 'day').format();

const tableHeader = [
  'Status',
  'Name',
  'Collection',
  'PDR',
  'Duration',
  'Last Update'
];

const tableRow = [
  'status',
  (d) => <Link to={`/granules/granule/${d.granuleId}/overview`}>{d.granuleId}</Link>,
  'collectionName',
  'pdrName',
  (d) => seconds(d.duration),
  (d) => fullDate(d.updatedAt)
];

const granuleFields = 'status,granuleId,collectionName,pdrName,duration,updatedAt';

var Home = React.createClass({
  displayName: 'Home',

  propTypes: {
    dispatch: React.PropTypes.func,
    stats: React.PropTypes.object,
    granules: React.PropTypes.object
  },

  componentWillMount: function () {
    this.queryStats();
  },

  queryStats: function () {
    // TODO set time span of granules
    this.props.dispatch(getStats());
    this.props.dispatch(listGranules({
      updatedAt__from: timespan,
      sort_by: 'updatedAt',
      order: 'desc',
      limit: 10,
      fields: granuleFields
    }));
  },

  render: function () {
    const { stats, granules } = this.props;

    const processingTimeUnits = get(stats, 'processingTime.unit', ' ').slice(0, 1);
    const storage = get(stats, 'storage.value');
    const overview = [
      [tally(get(stats, 'errors.value', nullValue)), 'Errors'],
      [tally(get(stats, 'collections.value', nullValue)), 'Collections'],
      [tally(get(stats, 'granules.value', nullValue)), 'Granules (received today)'],
      [get(stats, 'processingTime.value', nullValue) + processingTimeUnits, 'Average Processing Time'],
      [(storage ? tally(storage) + get(stats, 'storage.unit') : nullValue), 'Data Used'],
      [tally(get(stats, 'queues.value', nullValue)), 'SQS Queues'],
      [tally(get(stats, 'ec2.value', nullValue)), 'EC2 Instances']
    ];

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
                    <a className='overview-num' href='/'><span className='num--large'>{d[0]}</span> {d[1]}</a>
                  </li>
                ))}
              </ul>
            </div>
          </section>
          <section className='page__section'>
            <div className='row'>
              <div className='heading__wrapper--border'>
                <h2 className='heading--medium'>Recent Granules</h2>
              </div>
              <ul className='timeline--processing--overall'>
                <li><span className='num--medium'>40k</span> Granules Ingesting</li>
                <li><span className='num--medium'>100k</span> Granules Processing</li>
                <li><span className='num--medium'>30k</span> Granules Pushed to CMR</li>
                <li><span className='num--medium'>308k</span> Granules Archived</li>
              </ul>
              <SortableTable
                data={granules.list.data}
                header={tableHeader}
                primaryIdx={1}
                row={tableRow}
                props={[]} />
              <Link className='link--secondary' to='/granules'>View All Granules</Link>
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
