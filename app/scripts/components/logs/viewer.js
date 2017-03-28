'use strict';
import React from 'react';
import { interval, getLogs } from '../../actions';
import { logsUpdateInterval } from '../../config';
import moment from 'moment';
import LoadingEllipsis from '../app/loading-ellipsis';
import ErrorReport from '../errors/report';

const noLogs = {
  displayText: 'There are no Cumulus logs from the past 48 hours.',
  level: 'meta',
  key: 'no-logs-message'
};
const twoDays = 2 * 1000 * 60 * 60 * 24;

const noop = (d) => d;
var LogViewer = React.createClass({
  displayName: 'LogViewer',
  propTypes: {
    dispatch: React.PropTypes.func,
    query: React.PropTypes.object,
    logs: React.PropTypes.object
  },

  getInitialState: function () {
    return {
      filter: noop
    };
  },

  componentWillMount: function () {
    this.query();
  },

  componentWillReceiveProps: function (newProps) {
    if (JSON.stringify(newProps.query) !== JSON.stringify(this.props.query)) {
      const query = newProps.query || {};
      this.query(query);
    }

    if (newProps.logs.error && this.cancelInterval) {
      this.cancelInterval();
      this.cancelInterval = null;
    }
  },

  componentWillUnmount: function () {
    if (this.cancelInterval) { this.cancelInterval(); }
  },

  setFilter: function (e) {
    const value = e.currentTarget.value;
    if (!value || value.length < 2) {
      this.setState({ filter: noop });
    } else {
      this.setState({ filter: (d) => d.searchkey.indexOf(value) >= 0 });
    }
  },

  query: function (query) {
    // note, since the non-filtered endpoint is very slow,
    // enforce a filter.
    query = query || this.props.query || {level: 'info'};
    const { dispatch } = this.props;
    if (this.cancelInterval) { this.cancelInterval(); }

    let isFirstPull = true;
    function querySinceLast () {
      // on first pull, get the last 48 hours
      const duration = isFirstPull ? twoDays : logsUpdateInterval;
      const from = moment().subtract(duration, 'milliseconds').format();
      isFirstPull = false;
      return dispatch(getLogs(Object.assign({ 'timestamp__from': from }, query)));
    }
    this.cancelInterval = interval(querySinceLast, logsUpdateInterval, true);
  },

  render: function () {
    const { logs } = this.props;
    const items = logs.items.length ? logs.items.filter(this.state.filter) : [noLogs];
    return (
      <section className='page__section'>
        <div className='heading__wrapper--border'>
          <h2 className='heading--medium heading--shared-content with-description'>Logs {logs.inflight ? <LoadingEllipsis /> : null}</h2>
          <form className="search__wrapper form-group__element form-group__element--right form-group__element--right--sm form-group__element--small">
            <input className='search' type="search" onChange={this.setFilter}/>
            <span className="search__icon"></span>
          </form>
        </div>
        {logs.error ? <ErrorReport report={logs.error} /> : null}
        <div className='logs'>
          {items.map((d, i) => {
            let text = d.displayText;
            if (text.length > 200) {
              text = text.slice(0, 200) + '...';
            }
            const level = d.level ? d.level.toLowerCase() : 'info';
            return <p
              key={d.key}
              className='logs__item'><span className='logs__item--date'>{d.displayTime}</span> <span className={'logs__item--level logs__item--' + level}>{level}</span> {text}</p>;
          })}
        </div>
      </section>
    );
  }
});

export default LogViewer;
