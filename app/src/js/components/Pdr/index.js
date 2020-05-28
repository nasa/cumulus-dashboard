'use strict';
import React, { useState } from 'react';
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
import isEqual from 'lodash.isequal';

const withQueryWrapper = (Component, onQueryChange) => (props) => {
  return (
    <Component onQueryChange={onQueryChange} {...props} />
  );
};

const Pdrs = ({
  dispatch,
  location,
  params,
  stats
}) => {
  const { pathname } = location;
  const count = get(stats, 'count.data.pdrs.count');
  const AllPdrsWithWrapper = withQueryWrapper(PdrList, onQueryChange);
  const [queryOptions, setQueryOptions] = useState({});

  function query () {
    dispatch(getCount({
      type: 'pdrs',
      field: 'status'
    }));
    dispatch(listPdrs(queryOptions));
  }

  function onQueryChange (newQueryOptions) {
    if (!isEqual(newQueryOptions, queryOptions)) {
      setQueryOptions(newQueryOptions);
    }
  }

  return (
    <div className='page__pdrs'>
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
