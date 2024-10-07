import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { get } from 'object-path';
import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
// import withQueryParams from 'react-router-query-params';
import Sidebar from '../Sidebar/sidebar';
import { getCount, listPdrs } from '../../actions';
import DatePickerHeader from '../DatePickerHeader/DatePickerHeader';
import Pdr from './pdr';
import PdrOverview from './overview';
import PdrList from './list';
import { strings } from '../locale';
// import { filterQueryParams } from '../../utils/url-helper';
import withRouter from '../../withRouter';
import useQueryParams from '../../useQueryParams';

const Pdrs = ({ dispatch, location, queryParams, params, stats }) => {
  const { pathname } = location;
  const count = get(stats, 'count.sidebar.pdrs.count');
  const filteredQueryParams = useQueryParams(queryParams);

  const selectors = useSelector((state) => ({ stats: state.stats }));

  function query() {
    dispatch(listPdrs(filteredQueryParams));
  }

  useEffect(() => {
    dispatch(
      getCount({
        type: 'pdrs',
        field: 'status',
        sidebarCount: true
      })
    );
  }, [dispatch, selectors]);

  return (
    <div className="page__pdrs">
      <Helmet>
        <title> Cumulus PDRs </title>
      </Helmet>
      <DatePickerHeader onChange={query} heading={strings.pdrs} />
      <div className="page__content">
        <div className="wrapper__sidebar">
          <Sidebar currentPath={pathname} params={params} count={count} />
          <div className="page__content--shortened">
            <Routes>
              <Route
                exact
                path="/pdrs"
                render={(props) => (
                  <PdrOverview queryParams={filteredQueryParams} {...props} />
                )}
              ></Route>
              <Route
                path="/pdrs/pdr/:pdrName"
                render={(props) => (
                  <Pdr queryParams={filteredQueryParams} {...props} />
                )}
              ></Route>
              <Route
                path="/pdrs/:status"
                render={(props) => (
                  <PdrList queryParams={filteredQueryParams} {...props} />
                )}
              ></Route>
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

Pdrs.propTypes = {
  dispatch: PropTypes.func,
  location: PropTypes.object,
  params: PropTypes.object,
  queryParams: PropTypes.object,
  stats: PropTypes.object,
};

export default withRouter(Pdrs);
