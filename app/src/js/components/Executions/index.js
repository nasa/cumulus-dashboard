import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
// import withQueryParams from 'react-router-query-params';
import PropTypes from 'prop-types';
import Sidebar from '../Sidebar/sidebar';
import DatePickerHeader from '../DatePickerHeader/DatePickerHeader';
import ExecutionOverview from './overview';
import ExecutionStatus from './execution-status';
import ExecutionLogs from './execution-logs';
import ExecutionEvents from './execution-events';
import ExecutionsList from './executions-list';
import { getCount, listExecutions } from '../../actions';
import { strings } from '../locale';
// import { filterQueryParams } from '../../utils/url-helper';
import { withUrlHelper } from '../../withUrlHelper';

const Executions = ({ urlHelper }) => {
  const dispatch = useDispatch();
  const { queryParams, filterQueryParams, location } = urlHelper;
  const filteredQueryParams = filterQueryParams(queryParams);
  const { pathname } = location;
  const showSidebar = pathname !== '/executions/add';
  const showDatePicker = pathname === '/executions';

  function query () {
    dispatch(getCount({
      type: 'executions',
      field: 'status',
      ...filteredQueryParams
    }));
    dispatch(listExecutions(filteredQueryParams));
  }

  return (
    <div className='page__workflows'>
      <Helmet>
        <title> Cumulus Executions </title>
      </Helmet>
      {showDatePicker
        ? <DatePickerHeader onChange={query} heading={strings.executions}/>
        : <div className='content__header'>
          <div className='row'>
            <h1 className='heading--xlarge'>{strings.executions}</h1>
          </div>
        </div>
      }
      <div className='page__content'>
        <div className='wrapper__sidebar'>
          { showSidebar && <Sidebar currentPath={pathname} location={location}/> }
          <div className='page__content--shortened'>
            <Routes>
              <Route index element={<Navigate to="all" replace />} />
              <Route path='all' element={<ExecutionOverview queryParams={filteredQueryParams} />} />
              <Route path='/execution/:executionArn/logs' element={<ExecutionLogs />} />
              <Route path='/execution/:executionArn/events' element={<ExecutionEvents/>} />
              <Route path='/execution/:executionArn' element={<ExecutionStatus />} />
              <Route path='/executions-list/:collectionId/:granuleId' element ={<ExecutionsList />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

Executions.propTypes = {
  urlHelper: PropTypes.shape({
    location: PropTypes.object,
    filterQueryParams: PropTypes.func,
    queryParams: PropTypes.object
  }),
};

export default withUrlHelper(Executions);
