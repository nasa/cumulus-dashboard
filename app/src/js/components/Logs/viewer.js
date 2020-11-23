import truncate from 'lodash/truncate';
import noop from 'lodash/noop';
import React from 'react';
import PropTypes from 'prop-types';
import { interval, getLogs, clearLogs } from '../../actions';
import _config from '../../config';
// import moment from 'moment';
import LoadingEllipsis from '../LoadingEllipsis/loading-ellipsis';
import ErrorReport from '../Errors/report';
import SimpleDropdown from '../DropDown/simple-dropdown';
import { tally } from '../../utils/format';

const { logsUpdateInterval } = _config;

const noLogs = {
  displayText: 'There are no Cumulus logs from the past 48 hours.',
  level: 'meta',
  key: 'no-logs-message',
};
// const twoDays = 2 * 1000 * 60 * 60 * 24;

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

class LogViewer extends React.Component {
  constructor(props) {
    super(props);

    this.query = this.query.bind(this);
    this.cancelInterval = noop;

    this.state = {
      level: logLevels[0],
      search: '',
    };
  }

  componentDidMount() {
    this.query();
  }

  componentDidUpdate() {
    if (this.props.logs.error) {
      this.cancelInterval();
      this.cancelInterval = noop;
    }
  }

  componentWillUnmount() {
    this.cancelInterval();
    this.props.dispatch(clearLogs());
  }

  setSearch(search) {
    this.setState({ search }, this.query);
  }

  setSearchLevel(level) {
    this.setState({ level }, this.query);
  }

  query() {
    const { dispatch } = this.props;
    const { search, level } = this.state;
    const { value: levelValue } = level;
    const query = { ...this.props.query };

    if (search || query.q) {
      // Since the API ignores most other parameters when the `q` parameter is
      // specified, we must add the search query and log level directly to the
      // `q` parameter to ensure they are included in the query.  In addition,
      // enclosing `q` value in double-quotes to avoid potential undesired
      // interaction with the remainder of the constructed search query.
      query.q = [
        query.q && `"${query.q}"`,
        search && `(${search})`,
        `level:${levelValue}`,
      ]
        .filter(Boolean)
        .join(' AND ');
    } else {
      query.level = levelValue;
    }

    this.cancelInterval();
    dispatch(clearLogs());

    // let isFirstPull = true;
    function querySinceLast() {
      // on first pull, get the last 48 hours

      // deactivating until timestamp filter works again on the API side
      // const duration = isFirstPull ? twoDays : logsUpdateInterval;
      // const from = moment().subtract(duration, 'milliseconds').format();
      // isFirstPull = false;
      dispatch(getLogs(query));
    }

    this.cancelInterval = interval(querySinceLast, logsUpdateInterval, true);
  }

  render() {
    const { logs, notFound } = this.props;
    const { level } = this.state;
    const count = tally(logs.items.length);
    const items =
      logs.items.length || logs.inflight
        ? logs.items
        : [{ ...noLogs, ...(notFound ? { displayText: notFound } : {}) }];

    return (
      <section className="page__section page__section--logs">
        <div className="heading__wrapper--border">
          <h2 className="heading--medium heading--shared-content with-description">
            Logs{' '}
            <span className="num-title">
              {logs.inflight ? <LoadingEllipsis /> : count}
            </span>
          </h2>

          <div className='log-query-items'>
            <form className="form-group__element form-group__element--small">
              <SimpleDropdown
                label={'Level'}
                value={level}
                options={logLevels}
                id={'logs-viewer-dropdown'}
                onChange={(_, searchLevel, option) => this.setSearchLevel(option)}
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
                  value={this.state.search}
                  onChange={(e) => this.setSearch(e.target.value)}
                />
                <span className="search__icon" />
              </div>
            </form>
          </div>

        </div>

        {logs.error && <ErrorReport report={logs.error} truncate={true} />}

        <div className="logs">
          {items.map((item) => {
            const text = truncate(item.displayText, { length: 200 });
            const logLevel = logLevelName(item.level);

            return (
              <p key={item.key} className="logs__item">
                <span className="logs__item--date">{item.displayTime}</span>
                <span
                  className={`logs__item--level logs__item--${logLevel.toLowerCase()}`}
                >
                  {` ${logLevel.toUpperCase()} `}
                </span>
                {text}
              </p>
            );
          })}
        </div>
      </section>
    );
  }
}

LogViewer.propTypes = {
  dispatch: PropTypes.func,
  query: PropTypes.object,
  logs: PropTypes.object,
  notFound: PropTypes.string,
};

export default LogViewer;
