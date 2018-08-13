'use strict';
import React from 'react';
import Collapse from 'react-collapsible';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getExecutionStatus } from '../../actions';
import { displayCase, fullDate, parseJson } from '../../utils/format';

import {
  tableHeader,
  tableRow
} from '../../utils/table-config/execution-status';

import ErrorReport from '../errors/report';

import { ExecutionStatusGraph, getEventDetails } from './execution-status-graph';
import SortableTable from '../table/sortable';

var ExecutionStatus = React.createClass({
  displayName: 'Execution',

  propTypes: {
    executionStatus: PropTypes.object,
    params: PropTypes.object,
    dispatch: PropTypes.func,
    router: PropTypes.object
  },

  componentWillMount: function () {
    const { dispatch } = this.props;
    const { executionArn } = this.props.params;
    dispatch(getExecutionStatus(executionArn));
  },

  navigateBack: function () {
    const { router } = this.props;
    router.push('/executions');
  },

  errors: function () {
    return [].filter(Boolean);
  },

  renderEvents: function () {
    const { executionStatus } = this.props;
    let { executionHistory: { events } } = executionStatus;
    events.forEach((event) => {
      event.eventDetails = getEventDetails(event);
    });

    return (
      <SortableTable
        data={events.sort((a, b) => a.id > b.id ? 1 : -1)}
        dispatch={this.props.dispatch}
        header={tableHeader}
        row={tableRow}
        rowId='id'
        sortIdx={0}
        props={[]}
        order='asc'
        collapsible={true}
      />
    );
  },

  render: function () {
    const { executionStatus } = this.props;
    if (!executionStatus.execution) return null;

    let output;
    if (executionStatus.execution.output) {
      output = <dd>
        <Collapse trigger={'Show Output'} triggerWhenOpen={'Hide Output'}>
          <pre>{parseJson(executionStatus.execution.output)}</pre>
        </Collapse>
      </dd>;
    } else {
      output = <dd>N/A</dd>;
    }

    const errors = this.errors();

    return (
      <div className='page__component'>
      <section className='page__section page__section__header-wrapper'>
        <h1 className='heading--large heading--shared-content with-description width--three-quarters'>
          Execution {executionStatus.arn}
        </h1>

        {errors.length ? <ErrorReport report={errors} /> : null}
      </section>

      <section className='page__section width--half' style={{ display: 'inline-block', marginRight: '5%' }}>
        <div className='heading__wrapper--border'>
          <h2 className='heading--medium with-description'>Visual workflow</h2>
        </div>

        <ExecutionStatusGraph executionStatus={executionStatus} />
      </section>

      <section className='page__section width--half' style={{ display: 'inline-block', verticalAlign: 'top' }}>
        <div className='heading__wrapper--border'>
          <h2 className='heading--medium with-description'>Execution Details</h2>
        </div>

        <dl className='status--process'>
          <dt>Execution Status:</dt>
          <dd>{displayCase(executionStatus.execution.status)}</dd><br />

          <dt>Execution An:</dt>
          <dd>{executionStatus.execution.executionArn}</dd><br />

          <dt>State Machine An:</dt>
          <dd>{executionStatus.stateMachine.stateMachineArn}</dd><br />

          <dt>Started:</dt>
          <dd>{fullDate(executionStatus.execution.startDate)}</dd><br />

          <dt>Ended:</dt>
          <dd>{fullDate(executionStatus.execution.stopDate)}</dd><br />

          <dt>Input:</dt>
          <dd>
            <Collapse trigger={'Show Input'} triggerWhenOpen={'Hide Input'}>
              <pre>{parseJson(executionStatus.execution.input)}</pre>
            </Collapse>
          </dd><br />

          <dt>Output:</dt>
          {output}
          <br />
        </dl>
      </section>

      <section className='page__section'>
        <div className='heading__wrapper--border'>
          <h2 className='heading--medium with-description'>Events</h2>
        </div>

        {this.renderEvents()}
      </section>
      </div>
    );
  }
});

export default connect(state => ({
  executionStatus: state.executionStatus
}))(ExecutionStatus);
