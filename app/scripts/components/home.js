'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

var Home = React.createClass({
  displayName: 'Home',

  render: function () {
    return (
      <div className='page__home'>
        <div className='content__header'>
          <div className='row'>
            <h1 className='heading--xlarge'>Dashboard</h1>
          </div>
        </div>
        <section>
          <div className='row'>
            <ul>
              <li><span>2</span> Errors (1 ingest, 1 processing)</li>
              <li><span>100</span> Collections</li>
              <li><span>400</span> Granules (recieved today)</li>
              <li><span>0:01:20</span> Average Processing Time</li>
              <li><span>300 GB</span> Data Used</li>
              <li><span>300</span> SQS Queues</li>
              <li><span>30</span> EC2 Instances</li>
            </ul>
          </div>
        </section>
        <section>
          <div className='row'>
            <h2>Recent Granules</h2>
            <ul>
              <li><span>40k</span> Granules Ingesting</li>
              <li><span>100k</span> Granules Processing</li>
              <li><span>30k</span> Granules Pushed to CMR</li>
              <li><span>308k</span> Granules Archived</li>
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
                  <td><a href="#">Name of Granule</a></td>
                  <td><a href="#">Name of Collection</a></td>
                  <td><a href="#">307374</a></td>
                  <td>0:03:00</td>
                  <td>Sept. 14, 2016 14:50:49</td>
                </tr>
              </tbody>
            </table>
            <Link to='/granules'>View All Granules</Link>
          </div>
        </section>
        <section>
          <h2>Overview</h2>
          <select>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
        </section>
      </div>
    );
  }
});

export default connect(state => state)(Home);
