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
  getStats,
  listExecutions,
  listGranules,
  listRules,
} from '../actions';
import {
  nullValue,
  tally,
  seconds
} from '../utils/format';
import { pageSection, sectionHeader } from './Section/section';
import List from './Table/Table';
import { errorTableColumns } from '../utils/table-config/granules';
import linkToKibana from '../utils/kibana';
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

  buttonListSection (items, title, listId, sectionId) {
    const data = items.filter((d) => d[0] !== nullValue);
    if (!data.length) return null;
    return pageSection(
      title,
      String(sectionId),
      <div className="overview-num__wrapper overview-num__wrapper-home">
        <ul id={listId}>
          {data.map((d) => {
            const value = d[0];
            return (
              <li key={d[1]}>
                {this.isExternalLink(d[2])
                  ? (
                    <a id={d[1]} href={d[2]} className='overview-num' target='_blank'>
                      <span className={`num--large num--large--${this.getCountColor(d[1], value)}`}>{value}</span> {d[1]}
                    </a>
                    )
                  : (
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

  getCountByKey (counts, key) {
    const granuleCount = counts.find((c) => c.key === key);

    if (granuleCount) {
      return granuleCount.count;
    }
  }

  render () {
    const { list } = this.props.granules;
    const { stats, count } = this.props.stats;
    const { location } = this.props;
    const searchString = getPersistentQueryParams(location);
    const overview = [
      [tally(get(stats.data, 'errors.value')), 'Errors', linkToKibana()],
      [tally(get(stats.data, 'collections.value')), strings.collections, '/collections'],
      [tally(get(stats.data, 'granules.value')), strings.granules, '/granules'],
      [tally(get(this.props.executions, 'list.meta.count')), 'Executions', '/executions'],
      [tally(get(this.props.rules, 'list.meta.count')), 'Ingest Rules', '/rules'],
      [seconds(get(stats.data, 'processingTime.value', nullValue)), 'Average processing Time', '/']
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
          {pageSection(
            <>Select date and time to refine your results. <em>Time is UTC.</em></>,
            'datetime',
            <div className='datetime__range_wrapper'>
              <DatepickerRange onChange={this.query}/>
            </div>
          )}

          {sectionHeader('Metrics Overview', 'metricsOverview')}
          {this.buttonListSection(overview, 'Updates')}

          {sectionHeader(
            'Granules Updates',
            'updateGranules',
            <Link className='link--secondary link--learn-more' to={{ pathname: '/granules', search: searchString }}>{strings.view_granules_overview}</Link>
          )}
          {this.buttonListSection(
            updated,
            <>{strings.granules_updated}<span className='num-title'>{numGranules}</span></>
          )}

          {pageSection(
            strings.granules_errors,
            'listGranules',
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
