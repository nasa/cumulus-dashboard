'use strict';
import React from 'react';
import createReactClass from 'create-react-class';
import { getExecutionLogs } from '../../actions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ErrorReport from '../errors/report';

var ExecutionLogs = createReactClass({
  displayName: 'Execution',

  propTypes: {
    executionLogs: PropTypes.object,
    params: PropTypes.object,
    dispatch: PropTypes.func,
    router: PropTypes.object
  },

  componentWillMount: function () {
    const { dispatch } = this.props;
    const { executionName } = this.props.params;
    dispatch(getExecutionLogs(executionName));
  },

  navigateBack: function () {
    const { router } = this.props;
    router.push('/executions');
  },

  errors: function () {
    return [].filter(Boolean);
  },

  render: function () {
    const { executionLogs } = this.props;
    if (!executionLogs.results) return null;

    const errors = this.errors();

    return (
      <div className='page__component'>
      <section className='page__section page__section__header-wrapper'>
        <h1 className='heading--large heading--shared-content with-description'>
          Logs for Execution {executionLogs.results[0].executions}
        </h1>

        {errors.length ? <ErrorReport report={errors} /> : null}
      </section>

      <section className='page__section' style={{ display: 'inline-block', verticalAlign: 'top' }}>

        <div className='status--process'>
          <h2>Execution Details:</h2>
          <pre>{JSON.stringify(executionLogs.details, null, 2)}</pre><br />
        </div>

        <div className='status--process'>
        <h2>Execution Logs:</h2>
          <pre>{JSON.stringify(executionLogs.results, null, 2)}</pre><br />
        </div>

      </section>
      </div>
    );
  }
});

export default connect(state => ({
  executionLogs: state.executionLogs
}))(ExecutionLogs);
