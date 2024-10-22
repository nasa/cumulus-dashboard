import React, { useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import withQueryParams from 'react-router-query-params';
import { get } from 'object-path';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
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
import Tooltip from './Tooltip/tooltip';
import DatepickerRange from './Datepicker/DatepickerRange';
import { strings } from './locale';
import { getPersistentQueryParams } from '../utils/url-helper';

const Home = ({
  stats,
  executions,
  granules,
  rules,
  dispatch,
  location,
}) => {
  const generateQuery = () => ({
    error__exists: true,
    status: 'failed',
    limit: 20
  });

  const query = useCallback(() => {
    const defaultTimeRange = {
      timestamp__from: Date.now() - (24 * 60 * 60 * 1000),
      timestamp__to: Date.now()
    };

    dispatch(getStats());
    dispatch(getCount({ type: 'granules', field: 'status' }));
    dispatch(listExecutions(defaultTimeRange));
    dispatch(listGranules(generateQuery()));
    dispatch(listRules(defaultTimeRange));
  }, [dispatch]);

  useEffect(() => {
    dispatch(getCumulusInstanceMetadata())
      .then(() => query());
  }, [dispatch, query]);

  const isExternalLink = (link) => link && link.match('https?://');

  const getCountColor = (type, count) => {
    if (type === 'Failed' && count > 0) {
      if (count > 99) {
        return 'red';
      }
      return 'yellow';
    }
    return 'blue';
  };

  const buttonListSection = (items, title, listId, sectionId) => {
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
                {isExternalLink(d[2])
                  ? (
                    <a id={d[1]} href={d[2]} className='overview-num' target='_blank'>
                      <span className={`num--large num--large--${getCountColor(d[1], value)}`}>{value}</span> {d[1]}
                    </a>
                    )
                  : (
                    <Link id={d[1]} className='overview-num' to={{ pathname: d[2], search: getPersistentQueryParams(location) }}>
                      <span className={`num--large num--large--${getCountColor(d[1], value)}`}>{value}</span> {d[1]}
                    </Link>
                    )}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  const getCountByKey = (counts, key) => {
    const granuleCount = counts.find((c) => c.key === key);
    return granuleCount ? granuleCount.count : 0;
  };

  const { stats: statsData, count } = stats;
  const searchString = getPersistentQueryParams(location);
  const overview = [
    [tally(get(statsData.data, 'errors.value')), 'Errors', linkToKibana()],
    [tally(get(statsData.data, 'collections.value')), strings.collections, '/collections'],
    [tally(get(statsData.data, 'granules.value')), strings.granules, '/granules'],
    [tally(get(executions, 'list.meta.count')), 'Executions', '/executions'],
    [tally(get(rules, 'list.meta.count')), 'Ingest Rules', '/rules'],
    [seconds(get(statsData.data, 'processingTime.value', nullValue)), 'Average processing Time', '/']
  ];

  const granuleCount = get(count.data, 'granules.meta.count');
  const numGranules = !Number.isNaN(+granuleCount) ? `${tally(granuleCount)}` : 0;
  const granuleStatus = get(count.data, 'granules.count', []);

  const updated = [
    [tally(getCountByKey(granuleStatus, 'running')), 'Running', '/granules/running'],
    [tally(getCountByKey(granuleStatus, 'completed')), 'Completed', '/granules/completed'],
    [tally(getCountByKey(granuleStatus, 'failed')), 'Failed', '/granules/failed'],
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
              <DatepickerRange onChange={query}/>
            </div>
          )}

          <section className='page__section' id={'metricsOverview'}>
          <div className="row">
          <div className={'heading__wrapper--border'}>
          <h2 style={{ display: 'inline-block', marginRight: '10px' }} className={'heading--large'}>
            {'Metrics Overview'}
          </h2>
          <span>
          <Tooltip
                className="tooltip--light"
                id="overview-default-tooltip"
                placement={'right'}
                target={
                  <FontAwesomeIcon
                    className="button__icon--animation"
                    icon={faInfoCircle}
                  />
                }
                tip="The default range for this overview is within the last 24 hours."
              />
          </span>
          </div>
          </div>
          </section>
          {buttonListSection(overview, 'Updates')}

          {sectionHeader(
            'Granules Updates',
            'updateGranules',
            <Link className='link--secondary link--learn-more' to={{ pathname: '/granules', search: searchString }}>{strings.view_granules_overview}</Link>
          )}
          {buttonListSection(
            updated,
            <>{strings.granules_updated}<span className='num-title'>{numGranules}</span></>
          )}

          {pageSection(
            strings.granules_errors,
            'listGranules',
            <List
              list={granules.list}
              action={listGranules}
              tableColumns={errorTableColumns}
              initialSortId='updatedAt'
              query={generateQuery()}
            />
          )}
        </div>
      </div>
  );
};

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
  rules: state.rules,
  stats: state.stats,
  pdrs: state.pdrs
}))(Home)));
