import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { get } from 'object-path';
import { connect } from 'react-redux';
import { withRouter, Redirect, Route, Switch } from 'react-router-dom';
import Sidebar from '../Sidebar/sidebar';
import { getCount, listGranules } from '../../actions';
import { strings } from '../locale';
import AllGranules from './list';
import DatePickerHeader from '../DatePickerHeader/DatePickerHeader';
import GranuleOverview from './granule';
import GranulesOverview from './overview';
import isEqual from 'lodash.isequal';

const withQueryWrapper = (Component, onQueryChange) => (props) => {
  return (
    <Component onQueryChange={onQueryChange} {...props} />
  );
};

const Granules = ({
  dispatch,
  location,
  params,
  stats
}) => {
  const { pathname } = location;
  const count = get(stats, 'count.data.granules.count');
  const AllGranulesWithWrapper = withQueryWrapper(AllGranules, onQueryChange);
  const [queryOptions, setQueryOptions] = useState({});

  function query () {
    dispatch(getCount({
      type: 'granules',
      field: 'status'
    }));
    dispatch(listGranules(queryOptions));
  }

  function onQueryChange (newQueryOptions) {
    if (!isEqual(newQueryOptions, queryOptions)) {
      setQueryOptions(newQueryOptions);
    }
  }

  return (
    <div className='page__granules'>
      <DatePickerHeader onChange={query} heading={strings.granules}/>
      <div className='page__content'>
        <div className='wrapper__sidebar'>
          <Sidebar
            currentPath={pathname}
            params={params}
            count={count}
          />
          <div className='page__content--shortened'>
            <Switch>
              <Route exact path='/granules' component={GranulesOverview} />
              <Route path='/granules/granule/:granuleId' component={GranuleOverview} />
              <Route path='/granules/completed' component={AllGranulesWithWrapper} />
              <Route path='/granules/processing' component={AllGranulesWithWrapper} />
              <Route path='/granules/failed' component={AllGranulesWithWrapper} />
              <Redirect exact from='/granules/running' to='/granules/processing' />
            </Switch>
          </div>
        </div>
      </div>
    </div>
  );
};

Granules.propTypes = {
  location: PropTypes.object,
  params: PropTypes.object,
  dispatch: PropTypes.func,
  stats: PropTypes.object
};

export default withRouter(connect(state => ({
  stats: state.stats
}))(Granules));
