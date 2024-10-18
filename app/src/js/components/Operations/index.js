import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
// import withQueryParams from 'react-router-query-params';
import PropTypes from 'prop-types';
import Sidebar from '../Sidebar/sidebar';
import DatePickerHeader from '../DatePickerHeader/DatePickerHeader';
import OperationOverview from './overview';
import { listOperations } from '../../actions';
import { strings } from '../locale';
// import { filterQueryParams } from '../../utils/url-helper';
import { withUrlHelper } from '../../withUrlHelper';

const Operations = ({ urlHelper }) => {
  const dispatch = useDispatch();
  const { queryParams, filterQueryParams, location, params } = urlHelper;
  const filteredQueryParams = filterQueryParams(queryParams);
  const { pathname } = location;

  function query() {
    dispatch(listOperations(filteredQueryParams));
  }

  return (
    <div className='page__workflows'>
      <Helmet>
        <title> Cumulus Operations </title>
      </Helmet>
      <DatePickerHeader onChange={query} heading={strings.operations} />
      <div className='page__content'>
        <div className='wrapper__sidebar'>
          <Sidebar currentPath={pathname} params={params} />
          <div className='page__content--shortened'>
            <Routes>
              <Route
                exact
                path='/operations'
                render={(props) => (
                  <OperationOverview
                    {...props}
                    queryParams={filteredQueryParams}
                  />
                )}
              />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

Operations.propTypes = {
  urlHelper: PropTypes.shape({
    location: PropTypes.object,
    filterQueryParams: PropTypes.func,
    params: PropTypes.object,
    queryParams: PropTypes.object
  }),
};

export default withUrlHelper(Operations);
