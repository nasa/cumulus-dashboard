'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

var Home = React.createClass({
  displayName: 'Home',

  render: function () {
    return (
      <div className='page__home'>
        <div className='content__header content__header--lg'>
          <div className='row'>
            <h1 className='heading--xlarge'>Dashboard</h1>
          </div>
        </div>
        <div className='page__content'>
          <section className='page__section'>
            <div className='row'>
              <ul>
                <li className='overview-num'><span className='num--large'>2</span> Errors (1 ingest, 1 processing)</li>
                <li className='overview-num'><span className='num--large'>100</span> Collections</li>
                <li className='overview-num'><span className='num--large'>400</span> Granules (recieved today)</li>
                <li className='overview-num'><span className='num--large'>0:01:20</span> Average Processing Time</li>
                <li className='overview-num'><span className='num--large'>300 GB</span> Data Used</li>
                <li className='overview-num'><span className='num--large'>300</span> SQS Queues</li>
                <li className='overview-num'><span className='num--large'>30</span> EC2 Instances</li>
              </ul>
            </div>
          </section>
          <section className='page__section'>
            <div className='row'>
              <h2 className='heading--medium'>Recent Granules</h2>
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
              <Link to='/granules'>View All Granules</Link>
            </div>
          </section>
          <section className='page__section'>
            <div className='row'>
              <h2 className='heading--medium'>Overview</h2>
              <div className='dropdown__wrapper'>
                <select>
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="year">Last Year</option>
                </select>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
});

export default connect(state => state)(Home);
