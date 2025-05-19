import React, { useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { get } from 'object-path';
import Sidebar from '../Sidebar/sidebar';
import { getCount, listPdrs } from '../../actions';
import DatePickerHeader from '../DatePickerHeader/DatePickerHeader';
import Pdr from './pdr';
import PdrOverview from './overview';
import PdrList from './list';
import { strings } from '../locale';
import { withUrlHelper } from '../../withUrlHelper';

const Pdrs = ({ urlHelper }) => {
  const dispatch = useDispatch();
  const { queryParams, filterQueryParams, location, params } = urlHelper;
  const filteredQueryParams = filterQueryParams(queryParams);
  const { pathname } = location;

  const stats = useSelector((state) => ({ stats: state.stats }));
  const count = get(stats, 'count.sidebar.pdrs.count');

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
  }, [dispatch]);

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
              <Route index element={<Navigate to="all" replace />} />
              <Route
                path="all"
                element={<PdrOverview queryParams={filteredQueryParams} />}
              />
              <Route
                path="/pdr/:pdrName"
                element={<Pdr queryParams={filteredQueryParams} />}
              />
              <Route
                path="/:status"
                element={<PdrList queryParams={filteredQueryParams} />}
              />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

Pdrs.propTypes = {
  urlHelper: PropTypes.shape({
    location: PropTypes.object,
    filterQueryParams: PropTypes.func,
    params: PropTypes.object,
    queryParams: PropTypes.object
  }),
};

export default withUrlHelper(Pdrs);
