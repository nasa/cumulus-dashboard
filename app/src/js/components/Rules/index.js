import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import Sidebar from '../Sidebar/sidebar';
import RulesOverview from './overview';
import Rule from './rule';
import EditRule from './edit';
import AddRule from './add';
import { withUrlHelper } from '../../withUrlHelper';

const Rules = ({ urlHelper }) => {
  const { queryParams, filterQueryParams, location, params } = urlHelper;
  const filteredQueryParams = filterQueryParams(queryParams);
  const { pathname } = location;
  const showSidebar = pathname !== '/rules/add';

  return (
    <div className='page__rules'>
      <Helmet>
        <title> Rules Overview </title>
      </Helmet>
      <div className='content__header'>
        <div className='row'>
          <h1 className='heading--xlarge heading--shared-content'>Rules</h1>
        </div>
      </div>
      <div className='page__content'>
        <div className='wrapper__sidebar'>
          {showSidebar && (
            <Sidebar
              currentPath={pathname}
              params={params}
            />
          )}
          <div className={showSidebar ? 'page__content--shortened' : 'page__content'}>
            <Routes>
              <Route index element={<Navigate to="all" replace />} />
              <Route path='all' element={<RulesOverview queryParams={filteredQueryParams} />} />
              <Route path='rule/:ruleName' element={<Rule />} />
              <Route path='edit/:ruleName' element={<EditRule />} />
              <Route path='add' element={<AddRule />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

Rules.propTypes = {
  urlHelper: PropTypes.shape({
    location: PropTypes.object,
    filterQueryParams: PropTypes.func,
    params: PropTypes.object,
    queryParams: PropTypes.object
  }),
};

export default withUrlHelper(Rules);
