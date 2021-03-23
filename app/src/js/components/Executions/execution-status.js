import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getExecutionStatus, getCumulusInstanceMetadata } from '../../actions';
import { metaAccessors } from '../../utils/table-config/execution-status';

import ErrorReport from '../Errors/report';

import ExecutionStatusGraph from './execution-status-graph';
import Metadata from '../Table/Metadata';
import Loading from '../LoadingIndicator/loading-indicator';

const ExecutionStatus = ({
  cumulusInstance,
  dispatch,
  executionStatus,
  logs,
  match,
}) => {
  const [showInputModal, setShowInputModal] = useState(false);
  const [showOutputModal, setShowOutputModal] = useState(false);
  const { error, execution, executionHistory, stateMachine } = executionStatus;
  const { executionArn } = execution || {};
  const { executionArn: executionArnParam } = match.params;

  useEffect(() => {
    dispatch(getExecutionStatus(executionArnParam));
    dispatch(getCumulusInstanceMetadata());
  }, [dispatch, executionArnParam]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!execution) return null;
  if (executionArn !== executionArnParam) return <Loading />;

  const { name } = execution;
  const { metricsNotConfigured } = logs;

  function toggleModal(type) {
    switch (type) {
      case 'input':
        setShowInputModal(!showInputModal);
        break;
      case 'output':
        setShowOutputModal(!showOutputModal);
        break;
      default:
      // do nothing
    }
  }

  return (
    <div className="page__component">
      <Helmet>
        <title> Execution Status </title>
      </Helmet>
      <section className="page__section page__section__header-wrapper">
        <h1 className="heading--large heading--shared-content with-description width--three-quarters">
          Execution: {name}
        </h1>

        {error && <ErrorReport report={error} />}
      </section>

      {/* stateMachine's definition and executionHistory's event statuses are needed to draw the graph */}
      {stateMachine && executionHistory && (
        <section className="page__section">
          <div className="heading__wrapper--border">
            <h2 className="heading--medium with-description">Visual</h2>
          </div>
          <ExecutionStatusGraph executionStatus={executionStatus} />
        </section>
      )}

      <section className="page__section">
        <div className="heading__wrapper--border">
          <h2 className="heading--medium with-description">Details</h2>
        </div>
        <div className="execution__content status--process">
          <Metadata
            data={execution}
            accessors={metaAccessors({
              cumulusInstance,
              metricsNotConfigured,
              showInputModal,
              showOutputModal,
              toggleModal,
            })}
          />
        </div>
      </section>
    </div>
  );
};

ExecutionStatus.propTypes = {
  cumulusInstance: PropTypes.object,
  dispatch: PropTypes.func,
  executionStatus: PropTypes.object,
  logs: PropTypes.object,
  match: PropTypes.object,
};

export { ExecutionStatus };

export default withRouter(
  connect((state) => ({
    cumulusInstance: state.cumulusInstance,
    executionStatus: state.executionStatus,
    logs: state.logs,
  }))(ExecutionStatus)
);
