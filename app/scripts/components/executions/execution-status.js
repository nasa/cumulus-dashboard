'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  interval,
  getExecutionStatus
} from '../../actions';

import { displayCase } from '../../utils/format';
import { updateInterval } from '../../config';

import ErrorReport from '../errors/report';

import ExecutionStatusGraph from './execution-status-graph';

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
    this.reload();
  },

  componentWillUnmount: function () {
    if (this.cancelInterval) { this.cancelInterval(); }
  },

  reload: function (immediate, timeout) {
    timeout = timeout || updateInterval;
    const { dispatch } = this.props;
    const { executionArn } = this.props.params;
    console.log('executionArn', executionArn);

    if (this.cancelInterval) { this.cancelInterval(); }
    this.cancelInterval = interval(() => dispatch(getExecutionStatus(executionArn)), timeout, immediate);
  },

  fastReload: function () {
    // decrease timeout to better see updates
    this.reload(true, updateInterval / 2);
  },

  navigateBack: function () {
    const { router } = this.props;
    router.push('/executions');
  },

  errors: function () {
    return [].filter(Boolean);
  },

  render: function () {
    const { executionStatus } = this.props;
    if (!executionStatus.execution) return null;

    const errors = this.errors();

    return (
      <div className='page__component'>
      <section className='page__section page__section__header-wrapper'>
        <h1 className='heading--large heading--shared-content with-description width--three-quarters'>
          Execution {executionStatus.arn}
        </h1>

        <dl className='status--process'>
          <dt>Status:</dt>
          <dd className="">{displayCase(executionStatus.execution.status)}</dd>
        </dl>
      </section>

      <section className='page__section'>
        {errors.length ? <ErrorReport report={errors} /> : null}

        <div className='heading__wrapper--border'>
          <h2 className='heading--medium with-description'>Visual workflow</h2>
        </div>
        <ExecutionStatusGraph executionStatus={executionStatus} />
      </section>
      </div>
    );
  }
});

export default connect(state => ({
  executionStatus: state.executionStatus
}))(ExecutionStatus);
