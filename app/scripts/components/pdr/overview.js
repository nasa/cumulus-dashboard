'use strict';
import React from 'react';
import { connect } from 'react-redux';

import Overview from '../app/overview';

var PdrOverview = React.createClass({
  displayName: 'PdrOverview',

  renderOverview: function () {
    const overview = [
      [2, 'Errors'],
      ['200k', 'Active PDR\'s'],
      ['200k', 'Completed PDR\'s']
    ];
    return <Overview items={overview} inflight={false} />;
  },

  render: function () {
    const meta = {};
    // create the overview boxes
    const overview = this.renderOverview();
    return (
      <div className='page__component'>
        <section className='page__section'>
          <h1 className='heading--large heading--shared-content'>PDR's Overview</h1>
          <dl className="metadata__updated">
            <dt>Last Updated:</dt>
            <dd>Sept. 23, 2016</dd>
            <dd className='metadata__updated__time'>2:00pm EST</dd>
          </dl>
          {overview}
        </section>
        <section className='page__section'>
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium heading--shared-content'>Processing Granules{meta.count ? ` (${meta.count})` : null}</h2>
          </div>
        </section>
      </div>
    );
  }
});

export default connect(state => state)(PdrOverview);
