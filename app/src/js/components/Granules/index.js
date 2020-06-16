import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
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
import { withQueryWrapper } from '../QueryWrapper/query-wrapper';

const Granules = ({
  dispatch,
  location,
  params,
  stats
}) => {
  const { pathname } = location;
  const count = get(stats, 'count.data.granules.count');
  const [queryOptions, setQueryOptions] = useState({});
  const AllGranulesWithWrapper = withQueryWrapper(AllGranules, queryOptions, setQueryOptions);

  function query () {
    dispatch(listGranules(queryOptions));
  }

  useEffect(() => {
    dispatch(getCount({
      type: 'granules',
      field: 'status'
    }));
  }, [dispatch]);

  return (
    <div className='page__granules'>
      <Helmet>
        <title> Granules </title>
      </Helmet>
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
