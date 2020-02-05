'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { get } from 'object-path';
import {
  getCount,
  getCumulusInstanceMetadata,
  getDistApiGatewayMetrics,
  getDistApiLambdaMetrics,
  getTEALambdaMetrics,
  getDistS3AccessMetrics,
  getStats,
  interval,
  listExecutions,
  listGranules,
  listRules
} from '../actions';
import {
  nullValue,
  tally,
  seconds
} from '../utils/format';
import List from './Table/Table';
import GranulesProgress from './Granules/progress';
import {
  errorTableHeader,
  errorTableRow,
  errorTableSortProps
} from '../utils/table-config/granules';
import _config from '../config';
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
  kibanaGatewayExecutionSuccessesLink
} from '../utils/kibana';

import { strings } from './locale';

const { recent, updateInterval } = _config;

class Home extends React.Component {
  constructor () {
    super();
    this.displayName = 'Home';
    this.query = this.query.bind(this);
    this.generateQuery = this.generateQuery.bind(this);
  }

  componentDidMount () {
    this.cancelInterval = interval(() => {
      this.query();
    }, updateInterval, true);
    const { dispatch } = this.props;
    dispatch(getCumulusInstanceMetadata())
      .then(() => {
        dispatch(getDistApiGatewayMetrics(this.props.cumulusInstance));
        dispatch(getTEALambdaMetrics(this.props.cumulusInstance));
        dispatch(getDistApiLambdaMetrics(this.props.cumulusInstance));
        dispatch(getDistS3AccessMetrics(this.props.cumulusInstance));
      }
      );
  }

  componentWillUnmount () {
    if (this.cancelInterval) { this.cancelInterval(); }
  }

  query () {
    const { dispatch } = this.props;
    // TODO should probably time clamp this by most recent as well?
    dispatch(getStats({
      timestamp__from: recent
    }));
    dispatch(getCount({
      type: 'granules',
      field: 'status'
    }));
    dispatch(getDistApiGatewayMetrics(this.props.cumulusInstance));
    dispatch(getTEALambdaMetrics(this.props.cumulusInstance));
    dispatch(getDistApiLambdaMetrics(this.props.cumulusInstance));
    dispatch(getDistS3AccessMetrics(this.props.cumulusInstance));
    dispatch(listExecutions({}));
    dispatch(listRules({}));
  }

  generateQuery () {
    return {
      q: '_exists_:error AND status:failed',
      limit: 20
    };
  }

  isExternalLink (link) {
    return link.match('https?://');
  }

  renderButtonListSection (items, header, listId) {
    const data = items.filter(d => d[0] !== nullValue);
    if (!data.length) return null;
    return (
      <section className='page__section'>
        <div className='row'>
          <div className='heading__wrapper'>
            <h2 className='heading--medium heading--shared-content--right'>{header}</h2>
          </div>
          <div className="overview-num__wrapper-home">
            <ul id={listId}>
              {data.map(d => {
                const value = d[0];
                return (
                  <li key={d[1]}>
                    {this.isExternalLink(d[2]) ? (
                      <a id={d[1]} href={d[2]} className='overview-num' target='_blank'>
                        <span className='num--large'>{value}</span> {d[1]}
                      </a>
                    ) : (
                      <Link id={d[1]} className='overview-num' to={d[2] || '#'}>
                        <span className='num--large'>{value}</span> {d[1]}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>
    );
  }

  render () {
    const { list } = this.props.granules;
    const { stats, count } = this.props.stats;
    const { dist } = this.props;
    const overview = [
      [tally(get(stats.data, 'errors.value')), 'Errors', '/logs'],
      [tally(get(stats.data, 'collections.value')), strings.collections, '/collections'],
      [tally(get(stats.data, 'granules.value')), strings.granules, '/granules'],
      [tally(get(this.props.executions, 'list.meta.count')), 'Executions', '/executions'],
      [tally(get(this.props.rules, 'list.meta.count')), 'Ingest Rules', '/rules'],
      [seconds(get(stats.data, 'processingTime.value', nullValue)), 'Average processing Time']
    ];

    const distSuccessStats = [
      [tally(get(dist, 's3Access.successes')), 'S3 Access Successes', kibanaS3AccessSuccessesLink(this.props.cumulusInstance)],
      [tally(get(dist, 'teaLambda.successes')), 'TEA Lambda Successes', kibanaTEALambdaSuccessesLink(this.props.cumulusInstance)],
      [tally(get(dist, 'apiLambda.successes')), 'Distribution API Lambda Successes', kibanaApiLambdaSuccessesLink(this.props.cumulusInstance)],
      [tally(get(dist, 'apiGateway.execution.successes')), 'Gateway Execution Successes', kibanaGatewayExecutionSuccessesLink(this.props.cumulusInstance)],
      [tally(get(dist, 'apiGateway.access.successes')), 'Gateway Access Successes', kibanaGatewayAccessSuccessesLink(this.props.cumulusInstance)]
    ];

    const distErrorStats = [
      [tally(get(dist, 's3Access.errors')), 'S3 Access Errors', kibanaS3AccessErrorsLink(this.props.cumulusInstance)],
      [tally(get(dist, 'teaLambda.errors')), 'TEA Lambda Errors', kibanaTEALambdaErrorsLink(this.props.cumulusInstance)],
      [tally(get(dist, 'apiLambda.errors')), 'Distribution API Lambda Errors', kibanaApiLambdaErrorsLink(this.props.cumulusInstance)],
      [tally(get(dist, 'apiGateway.execution.errors')), 'Gateway Execution Errors', kibanaGatewayExecutionErrorsLink(this.props.cumulusInstance)],
      [tally(get(dist, 'apiGateway.access.errors')), 'Gateway Access Errors', kibanaGatewayAccessErrorsLink(this.props.cumulusInstance)]
    ];

    const granuleCount = get(count.data, 'granules.meta.count');
    const numGranules = !isNaN(granuleCount) ? `${tally(granuleCount)}` : null;
    const granuleStatus = get(count.data, 'granules.count', []);

    return (
      <div className='page__home'>
        <div className='content__header content__header--lg'>
          <div className='row'>
            <h1 className='heading--xlarge'>{strings.dashboard}</h1>
          </div>
        </div>

        <div className='page__content page__content__nosidebar'>
          <section className='page__section metrics--overview'>
            <div className='row'>
              <div className='heading__wrapper--border'>
                <h2 className='heading--large heading--shared-content--right'>Metrics Overview</h2>
              </div>
            </div>
          </section>

          {this.renderButtonListSection(overview, 'Updates')}
          {this.renderButtonListSection(distErrorStats, 'Distribution Errors', 'distributionErrors')}
          {this.renderButtonListSection(distSuccessStats, 'Distribution Successes', 'distributionSuccesses')}

          <section className='page__section update--granules'>
            <div className='row'>
              <div className='heading__wrapper--border'>
                <h2 className='heading--large heading--shared-content--right'>Granules Updates</h2>
                <Link className='link--secondary link--learn-more' to='/granules'>{strings.view_granules_overview}</Link>
              </div>
              <div className="heading__wrapper">
                <h2 className='heading--medium heading--shared-content--right'>{strings.granules_updated}<span className='num--title'>{numGranules}</span></h2>
              </div>

              <GranulesProgress granules={granuleStatus} />
            </div>
          </section>
          <section className='page__section list--granules'>
            <div className='row'>
              <div className='heading__wrapper'>
                <h2 className='heading--medium heading--shared-content--right'>{strings.granules_errors}</h2>
                <Link className='link--secondary link--learn-more' to='/logs'>{strings.view_logs}</Link>
              </div>
              <List
                list={list}
                dispatch={this.props.dispatch}
                action={listGranules}
                tableHeader={errorTableHeader}
                sortIdx={4}
                tableRow={errorTableRow}
                tableSortProps={errorTableSortProps}
                query={this.generateQuery()}
              />
            </div>
          </section>
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  dispatch: PropTypes.func,
  stats: PropTypes.object,
  dist: PropTypes.object,
  rules: PropTypes.object,
  granules: PropTypes.object,
  pdrs: PropTypes.object,
  executions: PropTypes.object,
  cumulusInstance: PropTypes.object
};

export { Home };
export default withRouter(connect(state => ({
  rules: state.rules,
  stats: state.stats,
  dist: state.dist,
  granules: state.granules,
  pdrs: state.pdrs,
  executions: state.executions,
  cumulusInstance: state.cumulusInstance
}))(Home));
