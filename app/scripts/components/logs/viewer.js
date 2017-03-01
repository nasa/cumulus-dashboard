'use strict';
import React from 'react';
import { interval, getLogs } from '../../actions';
import { logsUpdateInterval } from '../../config';
import moment from 'moment';

var LogViewer = React.createClass({
  displayName: 'LogViewer',
  propTypes: {
    dispatch: React.PropTypes.func,
    query: React.PropTypes.string,
    logs: React.PropTypes.object
  },

  componentWillMount: function () {
    this.query();
  },

  componentWillReceiveProps: function (newProps) {
    if (newProps.query !== this.props.query) {
      const query = newProps.query || 'none';
      this.query(query);
    }
  },

  componentWillUnmount: function () {
    if (this.cancelInterval) { this.cancelInterval(); }
  },

  query: function (query) {
    // note, since the non-filtered endpoint is very slow,
    // enforce a filter or none.
    query = query || this.props.query || 'none';
    const { dispatch } = this.props;
    if (this.cancelInterval) { this.cancelInterval(); }

    let isFirstPull = true;
    function querySinceLast () {
      // on first pull, get the last 24 hours
      const duration = isFirstPull ? 1000 * 60 * 60 * 24 : logsUpdateInterval;
      const from = moment().subtract(duration, 'milliseconds').format();
      isFirstPull = false;
      return dispatch(getLogs({
        q: query,
        date_from: from
      }));
    }
    this.cancelInterval = interval(querySinceLast, logsUpdateInterval, true);
  },

  render: function () {
    return (
      <div className='logs'>
        {this.props.logs.items.map((d, i) => {
          return <p
            key={d.key}
            className='logs__item'><span className='logs__item--date'>{d.displayTime}</span> <span className={'logs__item--level logs__item--' + d.level}>{d.level}</span> {d.displayText}</p>;
        })}
      </div>
    );
  }
});

export default LogViewer;
