import React from 'react';
import { withRouter, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import withQueryParams from 'react-router-query-params';
import PropTypes from 'prop-types';
import Sidebar from '../Sidebar/sidebar';
import DatePickerHeader from '../DatePickerHeader/DatePickerHeader';
import OperationOverview from './overview';
import { listOperations } from '../../actions';
import { strings } from '../locale';
import { filterQueryParams } from '../../utils/url-helper';

const Operations = ({ dispatch, location, params, queryParams }) => {
  const { pathname } = location;
  const filteredQueryParams = filterQueryParams(queryParams);

  function query() {
    dispatch(listOperations(filteredQueryParams));
  }

  return (
    <div className="page__workflows">
      <Helmet>
        <title> Cumulus Operations </title>
      </Helmet>
      <DatePickerHeader onChange={query} heading={strings.operations} />
      <div className="page__content">
        <div className="wrapper__sidebar">
          <Sidebar currentPath={pathname} params={params} />
          <div className="page__content--shortened">
            <Route
              exact
              path="/operations"
              render={(props) => (
                <OperationOverview
                  {...props}
                  queryParams={filteredQueryParams}
                />
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

Operations.propTypes = {
  dispatch: PropTypes.func,
  location: PropTypes.object,
  params: PropTypes.object,
  queryParams: PropTypes.object,
};

export default withRouter(withQueryParams()(connect()(Operations)));
