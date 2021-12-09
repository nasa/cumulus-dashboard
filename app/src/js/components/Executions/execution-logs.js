import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getExecutionLogs } from '../../actions';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';

import ErrorReport from '../Errors/report';
import { historyPushWithQueryParams } from '../../utils/url-helper';

class ExecutionLogs extends React.Component {
  constructor(props) {
    super(props);
    this.navigateBack = this.navigateBack.bind(this);
    this.errors = this.errors.bind(this);
    this.executionName = this.getExecutionName();
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(getExecutionLogs(this.executionName));
  }

  getExecutionName() {
    const { executionArn } = this.props.match.params;
    return executionArn.split(':').pop();
  }

  navigateBack() {
    historyPushWithQueryParams('/executions');
  }

  errors() {
    return [].filter(Boolean);
  }

  render() {
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
        label: 'Execution Logs',
        active: true
      }
    ];

    const { executionLogs } = this.props;
    if (!executionLogs.results) return null;
    const errors = this.errors();

    return (
      <div className='page__component'>
        <Helmet>
          <title> Execution Logs </title>
        </Helmet>
        <section className="page__section page__section__controls">
          <Breadcrumbs config={breadcrumbConfig} />
        </section>
        <section className='page__section page__section__header-wrapper'>
          <h1 className='heading--large heading--shared-content with-description'>
            Logs for Execution {this.executionName}
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
};

ExecutionLogs.displayName = 'Execution Logs';

export default withRouter(connect((state) => ({
  executionLogs: state.executionLogs
}))(ExecutionLogs));
