'use strict';
import React from 'react';
import Collapse from 'react-collapsible';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash.get';
import cloneDeep from 'lodash.clonedeep';
import { getExecutionStatus, getCumulusInstanceMetadata } from '../../actions';
import { displayCase, fullDate, parseJson } from '../../utils/format';
import { withRouter, Link } from 'react-router-dom';
import { kibanaExecutionLink } from '../../utils/kibana';

import { tableColumns } from '../../utils/table-config/execution-status';

import ErrorReport from '../Errors/report';

import ExecutionStatusGraph from './execution-status-graph';
import { getEventDetails } from './execution-graph-utils';
import SortableTable from '../SortableTable/SortableTable';
import Metadata from '../Table/Metadata';

class ExecutionStatus extends React.Component {
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

  navigateBack () {
    const { history } = this.props;
    history.push('/executions');
  }

  errors () {
    return [].filter(Boolean);
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
        sortIdx='id'
        props={[]}
        order='asc'
      />
    );
  }

  render () {
    const { executionStatus, cumulusInstance } = this.props;
    const { execution } = executionStatus;
    if (!execution) return null;

    const errors = this.errors();

    const metaAccessors = [
      {
        label: 'Execution Status',
        property: 'status',
        accessor: displayCase
      },
      {
        label: 'Execution Arn',
        property: 'executionArn'
      },
      {
        label: 'State Machine Arn',
        property: 'stateMachineArn'
      },
      {
        label: 'Async Operation ID',
        property: 'output',
        accessor: d => {
          const outputJson = JSON.parse(d);
          return get(outputJson.cumulus_meta, 'asyncOperationId');
        }
      },
      {
        label: 'Started',
        property: 'startDate',
        accessor: fullDate
      },
      {
        label: 'Ended',
        property: 'endDate',
        accessor: fullDate
      },
      {
        label: 'Parent Workflow Exectuion',
        property: 'input',
        accessor: d => {
          if (!d) return 'N/A';
          const input = JSON.parse(d);
          const parent = get(input.cumulus_meta, 'parentExecutionArn');
          if (parent) {
            return <Link to={'/executions/execution/' + parent} title={parent}>{parent}</Link>;
          } else {
            return 'N/A';
          }
        }
      },
      {
        label: 'Input',
        property: 'input',
        accessor: d => {
          if (d) {
            const trigger = <a href='#'>Show Input</a>;
            const triggerWhenOpen = <a href='#'>Hide Input</a>;
            return (
              <Collapse trigger={trigger} triggerWhenOpen={triggerWhenOpen}>
                <pre>{parseJson(d)}</pre>
              </Collapse>
            );
          } else {
            return 'N/A';
          }
        }
      },
      {
        label: 'Output',
        property: 'output',
        accessor: d => {
          if (d) {
            const trigger = <a href='#'>Show Output</a>;
            const triggerWhenOpen = <a href='#'>Hide Output</a>;
            const jsonData = new Blob([d], { type: 'text/json' });
            return (
              <Collapse trigger={trigger} triggerWhenOpen={triggerWhenOpen}>
                <a className='button button--small button--download button--green form-group__element--right'
                  id='download_link'
                  download='output.json'
                  href={window.URL.createObjectURL(jsonData)}
                >Download Output</a>
                <pre>{parseJson(d)}</pre>
              </Collapse>
            );
          } else {
            return 'N/A';
          }
        }
      },
      {
        label: 'Logs',
        property: 'name',
        accessor: d => {
          const kibanaLink = kibanaExecutionLink(cumulusInstance, d);
          if (kibanaLink && kibanaLink.length) {
            return <a href={kibanaLink} target="_blank">View Logs in Kibana</a>;
          } else {
            return <Link to={'/executions/execution/' + d + '/logs'} title={d + '/logs'}>View Execution Logs</Link>;
          }
        }
      }
    ];

    return (
      <div className='page__component'>
        <section className='page__section page__section__header-wrapper'>
          <h1 className='heading--large heading--shared-content with-description width--three-quarters'>
            Execution {executionStatus.arn}
          </h1>

          {errors.length ? <ErrorReport report={errors} /> : null}
        </section>

        {/* stateMachine's definition and executionHistory's event statuses are needed to draw the graph */}
        {
          (executionStatus.stateMachine && executionStatus.executionHistory)
            ? <section className='page__section'>
              <div className='heading__wrapper--border'>
                <h2 className='heading--medium with-description'>Visual workflow</h2>
              </div>

              <ExecutionStatusGraph executionStatus={executionStatus} />
            </section>
            : null
        }

        <section className='page__section'>
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium with-description'>Execution Details</h2>
          </div>
          <div className='execution__content'>
            <Metadata data={executionStatus.execution} accessors={metaAccessors} />
          </div>
        </section>

        {(executionStatus.executionHistory)
          ? <section className='page__section'>
            <div className='heading__wrapper--border'>
              <h2 className='heading--medium with-description'>Events</h2>
              <p>To find all task name and versions, select <b>More details</b> for the last Lambda- or Activity-type event. There you should find a key / value pair "workflow_tasks" which lists all tasks' version, name and arn.</p>
              <p><b>NOTE:</b>Task / version tracking is enabled as of Cumulus version 1.9.1.</p>
              <p><b>NOTE:</b>If the task output is greater than 10KB, the full message will be stored in an S3 Bucket. In these scenarios, task and version numbers are not part of the Lambda or Activity event output.</p>
            </div>

            {this.renderEvents()}
          </section>
          : null}

      </div>
    );
  }
}

ExecutionStatus.propTypes = {
  executionStatus: PropTypes.object,
  match: PropTypes.object,
  dispatch: PropTypes.func,
  cumulusInstance: PropTypes.object,
  history: PropTypes.object
};

ExecutionStatus.displayName = 'Execution';

export { ExecutionStatus };

export default withRouter(connect(state => ({
  executionStatus: state.executionStatus,
  cumulusInstance: state.cumulusInstance
}))(ExecutionStatus));
