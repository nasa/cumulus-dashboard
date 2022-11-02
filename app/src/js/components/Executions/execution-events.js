import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkSquareAlt } from '@fortawesome/free-solid-svg-icons';
import { withRouter } from 'react-router-dom';
import get from 'lodash/get';
import {
  getExecutionStatus,
  getCumulusInstanceMetadata,
  searchExecutionEvents,
  clearExecutionEventsSearch,
} from '../../actions';

import { tableColumns } from '../../utils/table-config/execution-status';

import ErrorReport from '../Errors/report';
import Search from '../Search/search';

import SortableTable from '../SortableTable/SortableTable';
import ListFilters from '../ListActions/ListFilters';
import { formatEvents } from '../../utils/table-config/executions';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';

const breadcrumbConfig = [
  {
    label: 'Dashboard Home',
    href: '/',
  },
  {
    label: 'Executions',
    href: '/executions'
  },
  {
    label: 'Execution Events',
    active: true
  }
];

const ExecutionEvents = ({
  dispatch,
  executionStatus,
  location,
  match,
}) => {
  const { params } = match || {};
  const { executionArn } = params;

  const { searchString } = executionStatus;
  let error = get(executionStatus, 'error');
  let recordData = get(executionStatus, 'data.data', {});

  // record data is an error message
  if (typeof recordData === 'string' && recordData.startsWith('Error')) {
    const recordError = `${recordData}, please download the execution record instead`;
    error = error || recordError;
    recordData = {};
  }

  const { execution, executionHistory, stateMachine } = recordData;
  const { events } = executionHistory || {};
  const formattedEvents = formatEvents(events);

  useEffect(() => {
    dispatch(getCumulusInstanceMetadata());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getExecutionStatus(executionArn));
    // when we have a new search, we also want to dispatch
  }, [dispatch, executionArn, searchString]);

  if (!execution) return (error ? <ErrorReport report={error} /> : null);

  return (
    <div className='page__component'>
      <Helmet>
        <title> Execution Events </title>
      </Helmet>
      <section className="page__section page__section__controls">
        <Breadcrumbs config={breadcrumbConfig} />
      </section>
      <section className='page__section page__section__header-wrapper'>
        <h1 className='heading--large heading--shared-content with-description width--three-quarters'>
          Events for Execution {execution.name}
        </h1>

        {error && <ErrorReport report={error} />}
      </section>

      {(stateMachine && executionHistory) &&
        <section className='page__section'>
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium with-description'>Details About The Events</h2>
          </div>
        </section>}

      {executionHistory &&
        <section className='page__section'>
          <div className='heading__wrapper--top-border'>
            <p>
              To find all task name and versions, select “More Details” for the last Lambda- or Activity-type event.
              There you should find a key / value pair “workflow_tasks” which lists all tasks’ version, name and arn.
            </p>
            <br />
            <p><b>NOTE:</b> Task / version tracking is enabled as of Cumulus version 1.9.1.</p>
            <br />
            <p><b>NOTE:</b> If the task output is greater than 10KB, the full message will be stored in an S3 Bucket.
              In these scenarios, task and version numbers are not part of the Lambda or Activity event output.</p>
            <br />
            <FontAwesomeIcon icon={faExternalLinkSquareAlt} />
            <i>Related workflow will open up into another window to view.</i>
          </div>
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium heading--shared-content'>All Events
              <span className="num-title">
                {`${events.length || 0}`}
              </span>
            </h2>
            <a className='csv__download button button--small button--green form-group__element--right'
              href='/workflows'
              target='_blank'
            ><FontAwesomeIcon icon={faExternalLinkSquareAlt} /> View Workflows</a>
          </div>
          <ListFilters>
            <Search
              action={searchExecutionEvents}
              clear={clearExecutionEventsSearch}
              label="Search"
              labelKey="type"
              options={formattedEvents}
              placeholder="Search Type"
            />
          </ListFilters>

          <SortableTable
            data={formattedEvents.sort((a, b) => (a.id > b.id ? 1 : -1))}
            tableColumns={tableColumns}
            rowId='id'
          />
        </section>}

    </div>
  );
};

ExecutionEvents.propTypes = {
  dispatch: PropTypes.func,
  executionStatus: PropTypes.object,
  location: PropTypes.object,
  match: PropTypes.object,
};

ExecutionEvents.displayName = 'Execution Events';

export { ExecutionEvents };

export default withRouter(connect((state) => ({
  executionStatus: state.executionStatus,
  cumulusInstance: state.cumulusInstance
}))(ExecutionEvents));
