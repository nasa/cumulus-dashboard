'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { get } from 'object-path';
import { getStats } from '../actions';
import { nullValue } from '../utils/format';

var Home = React.createClass({
  displayName: 'Home',

  propTypes: {
    dispatch: React.PropTypes.func,
    stats: React.PropTypes.object
  },

  componentWillMount: function () {
    this.queryStats();
  },

  queryStats: function () {
    // TODO set time span of granules
    this.props.dispatch(getStats());
  },

  render: function () {
    const { stats } = this.props;
    if (!Object.keys(stats).length) { return <div></div>; }

    const processingTimeUnits = get(stats, 'processingTime.unit', ' ').slice(0, 1);
    const storage = get(stats, 'storage.value');
    const overview = [
      [get(stats, 'errors.value', nullValue), 'Errors'],
      [get(stats, 'collections.value', nullValue), 'Collections'],
      [get(stats, 'granules.value', nullValue), 'Granules (received today)'],
      [get(stats, 'processingTime.value', nullValue) + processingTimeUnits, 'Average Processing Time'],
      [(storage ? storage + get(stats, 'storage.unit') : nullValue), 'Data Used'],
      [get(stats, 'queues.value', nullValue), 'SQS Queues'],
      [get(stats, 'ec2.value', nullValue), 'EC2 Instances']
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
              <table>
                <thead>
                  <tr>
                    <td>Status</td>
                    <td>Name</td>
                    <td>Collection</td>
                    <td>PDR</td>
                    <td>Duration</td>
                    <td>Last Update</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Ingesting</td>
                    <td className='table__main-asset'><a className='link--tertiary' href="#">Name of Granule</a></td>
                    <td><a className='link--tertiary' href="#">Name of Collection</a></td>
                    <td><a className='link--tertiary' href="#">307374</a></td>
                    <td>0:03:00</td>
                    <td>Sept. 14, 2016 14:50:49</td>
                  </tr>
                  <tr>
                    <td>Ingesting</td>
                    <td className='table__main-asset'><a className='link--tertiary' href="#">Name of Granule</a></td>
                    <td><a className='link--tertiary' href="#">Name of Collection</a></td>
                    <td><a className='link--tertiary' href="#">307374</a></td>
                    <td>0:03:00</td>
                    <td>Sept. 14, 2016 14:50:49</td>
                  </tr>
                </tbody>
              </table>
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
