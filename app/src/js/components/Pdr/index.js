'use strict';
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { get } from 'object-path';
import { connect } from 'react-redux';
import { withRouter, Route, Switch } from 'react-router-dom';
import Sidebar from '../Sidebar/sidebar';
import { getCount, listPdrs } from '../../actions';
import DatePickerHeader from '../DatePickerHeader/DatePickerHeader';
import Pdr from './pdr';
import PdrOverview from './overview';
import PdrList from './list';
import { strings } from '../locale';
import { withQueryWrapper } from '../QueryWrapper/query-wrapper';

const Pdrs = ({
  dispatch,
  location,
  params,
  stats
}) => {
  const { pathname } = location;
  const count = get(stats, 'count.data.pdrs.count');
  const [queryOptions, setQueryOptions] = useState({});
  const AllPdrsWithWrapper = withQueryWrapper(PdrList, queryOptions, setQueryOptions);

  function query () {
    dispatch(listPdrs(queryOptions));
  }

  useEffect(() => {
    dispatch(getCount({
      type: 'pdrs',
      field: 'status'
    }));
  }, [dispatch]);

  return (
    <div className='page__pdrs'>
      <Helmet>
        <title> Cumulus PDRs </title>
      </Helmet>
      <DatePickerHeader onChange={query} heading={strings.pdrs}/>
      <div className='page__content'>
        <div className='wrapper__sidebar'>
          <Sidebar
            currentPath={pathname}
            params={params}
            count={count}
          />
          <div className='page__content--shortened'>
            <Switch>
              <Route exact path='/pdrs' component={PdrOverview} />
              <Route path='/pdrs/active' component={AllPdrsWithWrapper} />
              <Route path='/pdrs/failed' component={AllPdrsWithWrapper} />
              <Route path='/pdrs/completed' component={AllPdrsWithWrapper} />
              <Route path='/pdrs/pdr/:pdrName' component={Pdr} />
            </Switch>
          </div>
        </div>
      </div>
    </div>
  );
};

Pdrs.propTypes = {
  location: PropTypes.object,
  params: PropTypes.object,
  dispatch: PropTypes.func,
  stats: PropTypes.object
};

export default withRouter(connect(state => ({
  stats: state.stats
}))(Pdrs));
