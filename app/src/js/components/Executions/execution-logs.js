'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { getExecutionLogs } from '../../actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import ErrorReport from '../Errors/report';

class ExecutionLogs extends React.Component {
  constructor () {
    super();
    this.displayName = 'Execution';
    this.navigateBack = this.navigateBack.bind(this);
    this.errors = this.errors.bind(this);
  }

  componentDidMount () {
    const { dispatch } = this.props;
    const { executionName } = this.props.match.params;
    dispatch(getExecutionLogs(executionName));
  }

  navigateBack () {
    const { router } = this.props;
    router.push('/executions');
  }

  errors () {
    return [].filter(Boolean);
  }

  render () {
    const { executionLogs } = this.props;
    const { executionName } = this.props.match.params;
    if (!executionLogs.results) return null;

    const errors = this.errors();

    return (
      <div className='page__component'>
        <section className='page__section page__section__header-wrapper'>
          <h1 className='heading--large heading--shared-content with-description'>
          Logs for Execution {executionName}
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
}

ExecutionLogs.propTypes = {
  executionLogs: PropTypes.object,
  match: PropTypes.object,
  dispatch: PropTypes.func,
  router: PropTypes.object
};

export default withRouter(connect(state => ({
  executionLogs: state.executionLogs
}))(ExecutionLogs));
