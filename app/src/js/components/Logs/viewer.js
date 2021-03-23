import isEqual from 'lodash/isEqual';
import noop from 'lodash/noop';
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { interval, getLogs, clearLogs } from '../../actions';
import _config from '../../config';
import LoadingEllipsis from '../LoadingEllipsis/loading-ellipsis';
import ErrorReport from '../Errors/report';
import SimpleDropdown from '../DropDown/simple-dropdown';
import { tally } from '../../utils/format';
import { fetchCurrentTimeFilters } from '../../utils/datepicker';

const { logsUpdateInterval } = _config;

const noLogs = {
  displayText: 'There are no logs from the past 48 hours.',
  level: 'meta',
  key: 'no-logs-message',
};

// Use a Map to preserve order of entries.  Otherwise, when using a plain
// object, during iteration over the keys (or entries), "numeric" keys are
// yielded in numeric order, not in insertion order
const logLevels = [
  {
    value: '[10 TO 60]',
    label: 'All',
  },
  {
    value: '60',
    label: 'Fatal',
  },
  {
    value: '50',
    label: 'Error',
  },
  {
    value: '40',
    label: 'Warn',
  },
  {
    value: '30',
    label: 'Info',
  },
  {
    value: '20',
    label: 'Debug',
  },
  {
    value: '10',
    label: 'Trace',
  },
];

/**
 * Returns the name of the specified "numeric" log level, or the specified
 * level converted to a string if no such level is defined.
 *
 * @param {number | string} level "numeric" log level to get the name of
 * @returns {string} name of the specified log level or the level converted to
 *    a string if no such level is defined
 */
const logLevelName = (level) => {
  const logOption = logLevels.find((logLevel) => logLevel.value === level);
  return logOption ? logOption.label : '';
};

const LogViewer = ({
  datepicker,
  dispatch,
  logs,
  notFound,
  query,
}) => {
  const [level, setLevel] = useState(logLevels[0]);
  const [searchText, setSearchText] = useState('');
  const cancelIntervalRef = useRef(noop);

  function buildQuery() {
    const levelString = isEqual(level, logLevels[0]) ? null : level.label;
    const returnQuery = { ...query };

    // get the last 48 hours if timestamp filter is not specified
    const timeFilters = fetchCurrentTimeFilters(datepicker);
    const endTime = moment.utc(new Date(timeFilters.timestamp__to || Date.now())).format();
    const startTime = timeFilters.timestamp__from
      ? moment.utc(new Date(timeFilters.timestamp__from)).format()
      : moment.utc().subtract(2, 'days').format();

    if (searchText || query.q) {
      // Since the API ignores most other parameters when the `q` parameter is
      // specified, we must add the search query and log level directly to the
      // `q` parameter to ensure they are included in the query.  In addition,
      // enclosing `q` value in double-quotes to avoid potential undesired
      // interaction with the remainder of the constructed search query.
      returnQuery.q = [
        query.q && `"${query.q}"`,
        searchText && `(${searchText})`,
        levelString && `level:${levelString}`,
        timeFilters && `@timestamp:[${startTime} TO ${endTime}]`,
      ]
        .filter(Boolean)
        .join(' AND ');
    } else if (levelString) {
      returnQuery.level = levelString;
    }

    return returnQuery;
  }

  function searchLogs() {
    const queryFunction = () => dispatch(getLogs(buildQuery()));
    cancelIntervalRef.current = interval(queryFunction, logsUpdateInterval, true);
  }

  function getNoLogsMessage() {
    const timeFilters = fetchCurrentTimeFilters(datepicker);
    return (timeFilters.timestamp__from)
      ? { ...noLogs, ...{ displayText: notFound || 'No recent logs' } }
      : noLogs;
  }

  useEffect(() => {
    searchLogs();
    return function cleanup() {
      cancelIntervalRef.current();
      cancelIntervalRef.current = noop;
      dispatch(clearLogs());
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, JSON.stringify(fetchCurrentTimeFilters(datepicker)), level, searchText]);

  useEffect(() => {
    if (logs.error) {
      cancelIntervalRef.current();
      cancelIntervalRef.current = noop;
    }
  }, [logs]);

  function render() {
    const { error, inflight, items: logsItems, metricsNotConfigured } = logs || {};
    if (metricsNotConfigured) return null;
    const count = tally(logsItems.length);
    const items =
      logsItems.length || inflight
        ? logsItems
        : [getNoLogsMessage()];

    return (
      <section className="page__section page__section--logs">
        <div className="heading__wrapper--border">
          <h2 className="heading--medium heading--shared-content with-description">
            Logs{' '}
            <span className="num-title">
              {inflight ? <LoadingEllipsis /> : count}
            </span>
          </h2>

          <div className='log-query-items'>
            <form className="form-group__element form-group__element--small">
              <SimpleDropdown
                label={'Level'}
                value={level}
                options={logLevels}
                id={'logs-viewer-dropdown'}
                onChange={(_, searchLevel, option) => setLevel(option)}
              />
            </form>
            <form className="form-group__element form-group__element--small">
              <label htmlFor="search-logs">Search</label>
              <div className="search__wrapper">
                <input
                  className="search"
                  id="search-logs"
                  type="search"
                  placeholder="Search all logs"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <span className="search__icon" />
              </div>
            </form>
          </div>

        </div>

        {error && <ErrorReport report={error} truncate={true} />}

        <div className="logs">
          {items.map((item) => {
            const logLevel = logLevelName(item.level);

            return (
              <p key={item.key} className="logs__item">
                <span className="logs__item--date">{item.displayTime}</span>
                <span
                  className={`logs__item--level logs__item--${logLevel.toLowerCase()}`}
                >
                  {` ${logLevel.toUpperCase()} `}
                </span>
                {item.displayText}
              </p>
            );
          })}
        </div>
      </section>
    );
  }

  return render();
};

LogViewer.propTypes = {
  datepicker: PropTypes.object,
  dispatch: PropTypes.func,
  logs: PropTypes.object,
  notFound: PropTypes.string,
  query: PropTypes.object,
};

export default connect((state) => ({
  datepicker: state.datepicker,
  logs: state.logs,
}))(LogViewer);
