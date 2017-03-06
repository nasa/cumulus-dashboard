'use strict';
import React from 'react';
import Loading from './loading-indicator';

const Overview = React.createClass({
  displayName: 'Overview',
  propTypes: {
    items: React.PropTypes.array,
    inflight: React.PropTypes.bool
  },
  render: function () {
    const { inflight, items } = this.props;
    return (
      <div className='row'>
        {inflight ? <Loading /> : null}
        <ul>
          {items.map(d => (
            <li key={d[1]}>
              <span className='overview-num' to='/'>
                <span className='num--large'>{d[0]}</span> {d[1]}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
});

export default Overview;
