'use strict';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Loading from '../LoadingIndicator/loading-indicator';
import { displayCase } from '../../utils/format';
import withQueryParams from 'react-router-query-params';
import { getCount } from '../../actions';
import { connect } from 'react-redux';
import { get } from 'object-path';

const Overview = ({
  dispatch,
  inflight,
  items,
  queryParams,
  stats,
  type
}) => {
  const statsCount = items || get(stats, `count.data.${type}.count`, []);

  useEffect(() => {
    if (items) return;
    dispatch(getCount({
      type,
      field: 'status',
      ...queryParams
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, items, JSON.stringify(queryParams), type]);
  return (
    <div className="overview-num__wrapper" data-cy="overview-num">
      {inflight && <Loading />}
      <ul>
        {statsCount.map((d) => {
          return (
            <li key={d.key}>
              <span className="overview-num overview-num--small" to="/">
                <span className="num--large num--large--color">{d.count}</span>
                <span className={`num-status num-status--${d.key}`}>
                  {displayCase(d.key)}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

Overview.propTypes = {
  dispatch: PropTypes.func,
  inflight: PropTypes.bool,
  items: PropTypes.array,
  queryParams: PropTypes.object,
  stats: PropTypes.object,
  type: PropTypes.string,
};

export default withQueryParams()(connect(state => ({ stats: state.stats }))(Overview));
