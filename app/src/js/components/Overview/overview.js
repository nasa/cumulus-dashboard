'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import Loading from '../LoadingIndicator/loading-indicator';

class Overview extends React.Component {
  constructor () {
    super();
    this.displayName = 'Overview';
  }

  render () {
    const { inflight, items } = this.props;
    return (
      <div className='overview-num__wrapper'>
        {inflight ? <Loading /> : null}
        <ul>
          {items.map(d => (
            <li key={d[1]}>
              <span className='overview-num overview-num--small' to='/'>
                <span className='num--large num--large--color'>{d[0]}</span><span className='num-status'>{d[1]}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

Overview.propTypes = {
  items: PropTypes.array,
  inflight: PropTypes.bool
};

export default Overview;
