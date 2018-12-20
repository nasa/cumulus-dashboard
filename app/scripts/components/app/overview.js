'use strict';
import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import Loading from './loading-indicator';

const Overview = createReactClass({
  displayName: 'Overview',
  propTypes: {
    items: PropTypes.array,
    inflight: PropTypes.bool
  },
  render: function () {
    const { inflight, items } = this.props;
    return (
      <div className='overview-num__wrapper'>
        {inflight ? <Loading /> : null}
        <ul>
          {items.map(d => (
            <li key={d[1]}>
              <span className='overview-num overview-num--small' to='/'>
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
