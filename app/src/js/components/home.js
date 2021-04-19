import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import withQueryParams from 'react-router-query-params';
import { get } from 'object-path';
import {
  getCount,
  getCumulusInstanceMetadata,
  getDistApiGatewayMetrics,
  getDistApiLambdaMetrics,
  getTEALambdaMetrics,
  getDistS3AccessMetrics,
  getStats,
  listExecutions,
  listGranules,
  listRules
} from '../actions';
import {
  nullValue,
  tally,
  seconds
} from '../utils/format';
import ErrorReport from './Errors/report';
import List from './Table/Table';
import { errorTableColumns } from '../utils/table-config/granules';
import {
  kibanaS3AccessErrorsLink,
  kibanaS3AccessSuccessesLink,
  kibanaApiLambdaErrorsLink,
  kibanaApiLambdaSuccessesLink,
  kibanaTEALambdaErrorsLink,
  kibanaTEALambdaSuccessesLink,
  kibanaGatewayAccessErrorsLink,
  kibanaGatewayAccessSuccessesLink,
  kibanaGatewayExecutionErrorsLink,
  kibanaGatewayExecutionSuccessesLink,
  kibanaGranuleErrorsLink,
} from '../utils/kibana';
import DatepickerRange from './Datepicker/DatepickerRange';
import { strings } from './locale';
import { getPersistentQueryParams } from '../utils/url-helper';

class Home extends React.Component {
  constructor (props) {
    super(props);
    this.query = this.query.bind(this);
  }

  componentDidMount () {
    const { dispatch } = this.props;
    dispatch(getCumulusInstanceMetadata())
      .then(() => this.query());
  }

  query () {
    const { dispatch } = this.props;
    dispatch(getStats());
    dispatch(getCount({ type: 'granules', field: 'status' }));
    dispatch(getDistApiGatewayMetrics(this.props.cumulusInstance));
    dispatch(getTEALambdaMetrics(this.props.cumulusInstance));
    dispatch(getDistApiLambdaMetrics(this.props.cumulusInstance));
    dispatch(getDistS3AccessMetrics(this.props.cumulusInstance));
    dispatch(listExecutions({}));
    dispatch(listGranules(this.generateQuery()));
    dispatch(listRules({}));
  }

  generateQuery () {
    return {
      error__exists: true,
      status: 'failed',
      limit: 20
    };
  }

  isExternalLink (link) {
    return link && link.match('https?://');
  }

  getCountColor (type, count) {
    if (type === 'Failed' && count > 0) {
      if (count > 99) {
        return 'red';
      }
      return 'yellow';
    }
    return 'blue';
  }

  buttonListSection (items, title, listId) {
    const data = items.filter((d) => d[0] !== nullValue);
    if (!data.length) return null;
    return this.pageSection(
      title, undefined,
      <div className="overview-num__wrapper overview-num__wrapper-home">
        <ul id={listId}>
          {data.map((d) => {
            const value = d[0];
            return (
              <li key={d[1]}>
                {this.isExternalLink(d[2]) ? (
                  <a id={d[1]} href={d[2]} className='overview-num' target='_blank'>
                    <span className={`num--large num--large--${this.getCountColor(d[1], value)}`}>{value}</span> {d[1]}
                  </a>
                ) : (
                  <Link id={d[1]} className='overview-num' to={{ pathname: d[2], search: getPersistentQueryParams(this.props.location) }}>
                    <span className={`num--large num--large--${this.getCountColor(d[1], value)}`}>{value}</span> {d[1]}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  /**
   *
   * @param {Object} dist - distribution state object.
   * @returns - Error Report when any distribution metric contains an error.
   */
  distrubutionConnectionErrors (dist) {
    const errors = Object.keys(dist).filter((key) => dist[key].error).map((key) => dist[key].error);
    if (errors.length === 0) return undefined;
    const uniqueErrors = [...new Set(errors)];
    return this.section({
      children:
      <div className='row'>
        <ErrorReport report={`Distribution Metrics: ${uniqueErrors.join('\n')}`}/>
      </div>
    });
  }

  getCountByKey (counts, key) {
    const granuleCount = counts.find((c) => c.key === key);

    if (granuleCount) {
      return granuleCount.count;
    }
  }

  pageSection (title, className, children) {
    return this.section({ title, className, children });
  }

  sectionHeader (className, title, link) {
    return this.section({ className, title, link, size: 'large', border: true });
  }

  section ({ className, title, link, border = false, size = 'medium', children }) {
    const borderMod = border ? '--border' : '';
    const sizeMod = `--${size}`;
    const additionalClassName = className || '';
    return (
      <section className={`page__section ${additionalClassName}`}>
        <div className='row'>
          <div className={`heading__wrapper${borderMod}`}>
            <h2 className={`heading${sizeMod} heading--shared-content--right`}>
              {title}
            </h2>
            {link}
          </div>
          {children}
        </div>
      </section>
    );
  }

  render () {
    const { list } = this.props.granules;
    const { stats, count } = this.props.stats;
    const { dist, location } = this.props;
    const searchString = getPersistentQueryParams(location);
    const overview = [
      [tally(get(stats.data, 'errors.value')), 'Errors', kibanaGranuleErrorsLink(this.props.cumulusInstance, this.props.datepicker)],
      [tally(get(stats.data, 'collections.value')), strings.collections, '/collections'],
      [tally(get(stats.data, 'granules.value')), strings.granules, '/granules'],
      [tally(get(this.props.executions, 'list.meta.count')), 'Executions', '/executions'],
      [tally(get(this.props.rules, 'list.meta.count')), 'Ingest Rules', '/rules'],
      [seconds(get(stats.data, 'processingTime.value', nullValue)), 'Average processing Time', '/']
    ];

    const distSuccessStats = [
      [tally(get(dist, 's3Access.successes')), 'S3 Access Successes', kibanaS3AccessSuccessesLink(this.props.cumulusInstance, this.props.datepicker)],
      [tally(get(dist, 'teaLambda.successes')), 'TEA Lambda Successes', kibanaTEALambdaSuccessesLink(this.props.cumulusInstance, this.props.datepicker)],
      [tally(get(dist, 'apiLambda.successes')), 'Distribution API Lambda Successes', kibanaApiLambdaSuccessesLink(this.props.cumulusInstance, this.props.datepicker)],
      [tally(get(dist, 'apiGateway.execution.successes')), 'Gateway Execution Successes', kibanaGatewayExecutionSuccessesLink(this.props.cumulusInstance, this.props.datepicker)],
      [tally(get(dist, 'apiGateway.access.successes')), 'Gateway Access Successes', kibanaGatewayAccessSuccessesLink(this.props.cumulusInstance, this.props.datepicker)]
    ];

    const distErrorStats = [
      [tally(get(dist, 's3Access.errors')), 'S3 Access Errors', kibanaS3AccessErrorsLink(this.props.cumulusInstance, this.props.datepicker)],
      [tally(get(dist, 'teaLambda.errors')), 'TEA Lambda Errors', kibanaTEALambdaErrorsLink(this.props.cumulusInstance, this.props.datepicker)],
      [tally(get(dist, 'apiLambda.errors')), 'Distribution API Lambda Errors', kibanaApiLambdaErrorsLink(this.props.cumulusInstance, this.props.datepicker)],
      [tally(get(dist, 'apiGateway.execution.errors')), 'Gateway Execution Errors', kibanaGatewayExecutionErrorsLink(this.props.cumulusInstance, this.props.datepicker)],
      [tally(get(dist, 'apiGateway.access.errors')), 'Gateway Access Errors', kibanaGatewayAccessErrorsLink(this.props.cumulusInstance, this.props.datepicker)]
    ];

    const granuleCount = get(count.data, 'granules.meta.count');
    const numGranules = !Number.isNaN(+granuleCount) ? `${tally(granuleCount)}` : 0;
    const granuleStatus = get(count.data, 'granules.count', []);

    const updated = [
      [tally(this.getCountByKey(granuleStatus, 'running')), 'Running', '/granules/running'],
      [tally(this.getCountByKey(granuleStatus, 'completed')), 'Completed', '/granules/completed'],
      [tally(this.getCountByKey(granuleStatus, 'failed')), 'Failed', '/granules/failed'],
    ];

    return (
      <div className='page__home'>
        <Helmet>
          <title> Cumulus Home  </title>
        </Helmet>
        <div className='content__header content__header--lg'>
          <div className='row'>
            <h1 className='heading--xlarge'>{strings.dashboard}</h1>
          </div>
        </div>

        <div className='page__content page__content--nosidebar'>

          {this.pageSection(
            <>Select date and time to refine your results. <em>Time is UTC.</em></>,
            'datetime',
            <div className='datetime__range_wrapper'>
              <DatepickerRange onChange={this.query}/>
            </div>
          )}

          {this.sectionHeader('metrics--overview', 'Metrics Overview')}
          {this.buttonListSection(overview, 'Updates')}

          {this.sectionHeader('distribution--overview', 'Distribution Overview')}
          {this.distrubutionConnectionErrors(dist)}
          {this.buttonListSection(distErrorStats, 'Distribution Errors', 'distributionErrors')}
          {this.buttonListSection(distSuccessStats, 'Distribution Successes', 'distributionSuccesses')}

          {this.sectionHeader(
            'update--granules', 'Granules Updates',
            <Link className='link--secondary link--learn-more' to={{ pathname: '/granules', search: searchString }}>{strings.view_granules_overview}</Link>
          )}
          {this.buttonListSection(
            updated,
            <>{strings.granules_updated}<span className='num-title'>{numGranules}</span></>
          )}

          {this.pageSection(
            strings.granules_errors,
            'list--granules',
            <List
              list={list}
              action={listGranules}
              tableColumns={errorTableColumns}
              initialSortId='timestamp'
              query={this.generateQuery()}
            />
          )}
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  cumulusInstance: PropTypes.object,
  datepicker: PropTypes.object,
  dist: PropTypes.object,
  executions: PropTypes.object,
  granules: PropTypes.object,
  rules: PropTypes.object,
  stats: PropTypes.object,
  dispatch: PropTypes.func,
  location: PropTypes.object
};

export { Home };

export default withRouter(withQueryParams()(connect((state) => ({
  cumulusInstance: state.cumulusInstance,
  datepicker: state.datepicker,
  dist: state.dist,
  executions: state.executions,
  granules: state.granules,
  pdrs: state.pdrs,
  rules: state.rules,
  stats: state.stats
}))(Home)));
