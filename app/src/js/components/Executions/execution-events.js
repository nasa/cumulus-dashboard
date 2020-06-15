'use strict';
import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cloneDeep from 'lodash.clonedeep';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withRouter } from 'react-router-dom';
import {
  getExecutionStatus,
  getCumulusInstanceMetadata,
  searchExecutionEvents,
  clearExecutionEventsSearch
} from '../../actions';

import { tableColumns } from '../../utils/table-config/execution-status';

import ErrorReport from '../Errors/report';
import Search from '../Search/search';

import { getEventDetails } from './execution-graph-utils';
import SortableTable from '../SortableTable/SortableTable';

class ExecutionEvents extends React.Component {
  constructor () {
    super();
    this.navigateBack = this.navigateBack.bind(this);
    this.errors = this.errors.bind(this);
    this.renderEvents = this.renderEvents.bind(this);
  }

  componentDidMount () {
    const { dispatch } = this.props;
    const { executionArn } = this.props.match.params;
    dispatch(getExecutionStatus(executionArn));
    dispatch(getCumulusInstanceMetadata());
  }

  componentDidUpdate (prevProps) {
    const { dispatch } = this.props;
    const { executionArn } = this.props.match.params;
    const { search } = this.props.location;
    const { search: prevSearch } = prevProps.location;
    if (search !== prevSearch) {
      dispatch(getExecutionStatus(executionArn));
    }
  }

  renderEvents () {
    const { executionStatus } = this.props;
    const { executionHistory: { events } } = executionStatus;
    const mutableEvents = cloneDeep(events);
    mutableEvents.forEach((event) => {
      event.eventDetails = getEventDetails(event);
    });

    return (
      <SortableTable
        data={mutableEvents.sort((a, b) => a.id > b.id ? 1 : -1)}
        dispatch={this.props.dispatch}
        tableColumns={tableColumns}
        rowId='id'
        sortId='id'
        props={[]}
        order='asc'
      />
    );
  }

  navigateBack () {
    const { history } = this.props;
    history.push('/executions');
  }

  errors () {
    return [].filter(Boolean);
  }

  render () {
    const { executionStatus, dispatch } = this.props;
    if (!executionStatus.execution) return null;

    const errors = this.errors();
    return (
      <div className='page__component'>
        <Helmet>
          <title> Execution Events </title>
        </Helmet>
        <section className='page__section page__section__header-wrapper'>
          <h1 className='heading--large heading--shared-content with-description width--three-quarters'>
            Events for Execution {executionStatus.execution.name}
          </h1>

          {errors.length ? <ErrorReport report={errors} /> : null}
        </section>

        {
          (executionStatus.stateMachine && executionStatus.executionHistory)
            ? <section className='page__section'>
              <div className='heading__wrapper--border'>
                <h2 className='heading--medium with-description'>Details About The Events</h2>
              </div>
            </section>
            : null
        }

        {(executionStatus.executionHistory)
          ? <section className='page__section'>
            <div className='heading__wrapper--top-border'>
              <p>To find all task name and versions, select “More Details” for the last Lambda- or Activity-type event. There you should find a key / value pair “workflow_tasks” which lists all tasks’ version, name and arn.</p>
              <br></br>
              <p><b>NOTE:</b> Task / version tracking is enabled as of Cumulus version 1.9.1.</p>
              <br></br>
              <p><b>NOTE:</b> If the task output is greater than 10KB, the full message will be stored in an S3 Bucket. In these scenarios, task and version numbers are not part of the Lambda or Activity event output.</p>
              <br></br>
              <FontAwesomeIcon icon="external-link-square-alt" /> <i>Related workflow will open up into another window to view.</i>
            </div>
            <div className='heading__wrapper--border'>
              <h2 className='heading--medium heading--shared-content'>All Events
                <span className="num-title">
                  {`${executionStatus.executionHistory.events.length || 0}`}
                </span>
              </h2>
              <a className='csv__download button button--small button--green form-group__element--right'
                href='/workflows'
                target='_blank'
              ><FontAwesomeIcon icon="external-link-square-alt" /> View Workflows</a>
            </div>
            <div className='filters'>
              <Search
                dispatch={dispatch}
                action={searchExecutionEvents}
                clear={clearExecutionEventsSearch}
                label='Search'
                placeholder="Search Type"
              />
            </div>

            {this.renderEvents()}
          </section>
          : null}

      </div>
    );
  }
}

ExecutionEvents.propTypes = {
  executionStatus: PropTypes.object,
  match: PropTypes.object,
  dispatch: PropTypes.func,
  location: PropTypes.object,
  history: PropTypes.object
};

ExecutionEvents.displayName = 'Execution Events';

export { ExecutionEvents };

export default withRouter(connect(state => ({
  executionStatus: state.executionStatus,
  cumulusInstance: state.cumulusInstance
}))(ExecutionEvents));
