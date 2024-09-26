import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { Route, Routes } from 'react-router-dom';
import withQueryParams from 'react-router-query-params';
import Sidebar from '../Sidebar/sidebar';
import RulesOverview from './overview';
import Rule from './rule';
import EditRule from './edit';
import AddRule from './add';
import { filterQueryParams } from '../../utils/url-helper';
import withRouter from '../../withRouter';

const Rules = ({
  location,
  params,
  queryParams,
}) => {
  const { pathname } = location;
  const showSidebar = pathname !== '/rules/add';
  const filteredQueryParams = filterQueryParams(queryParams);
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
              <Route exact path='/rules' render={(props) => <RulesOverview {...props} queryParams={filteredQueryParams} />}></Route>
              <Route path='/rules/rule/:ruleName' element={<Rule />}></Route>
              <Route path='/rules/edit/:ruleName' element={<EditRule />}></Route>
              <Route path='/rules/add' element={<AddRule />}></Route>
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

Rules.propTypes = {
  location: PropTypes.object,
  params: PropTypes.object,
  queryParams: PropTypes.object,
};

export default withRouter(withQueryParams()(Rules));
