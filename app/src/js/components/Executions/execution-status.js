import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import get from 'lodash/get';
import { getExecutionStatus, getCumulusInstanceMetadata } from '../../actions';
import {
  metaAccessors,
  associatedGranulesTableColumns,
} from '../../utils/table-config/execution-status';

import List from '../Table/Table';
import ErrorReport from '../Errors/report';

import ExecutionStatusGraph from './execution-status-graph';
import Metadata from '../Table/Metadata';
import Loading from '../LoadingIndicator/loading-indicator';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import { handleDownloadUrlClick } from '../../utils/download-file';

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
    label: 'Execution Details',
    active: true
  }
];

const ExecutionStatus = ({
  cumulusInstance,
  dispatch,
  executionStatus,
  logs,
  match,
}) => {
  const [showInputModal, setShowInputModal] = useState(false);
  const [showOutputModal, setShowOutputModal] = useState(false);
  let error = get(executionStatus, 'error');
  let recordData = get(executionStatus, 'data.data', {});
  const recordUrl = get(executionStatus, 'data.presignedS3Url');

  // record data is an error message
  if (typeof recordData === 'string' && recordData.startsWith('Error')) {
    const recordError = `${recordData}, please download the execution record instead`;
    error = error || recordError;
    recordData = {};
  }

  const { execution, executionHistory, stateMachine } = recordData;
  const { executionArn } = execution || {};
  const { executionArn: executionArnParam } = match.params;

  useEffect(() => {
    dispatch(getExecutionStatus(executionArnParam));
    dispatch(getCumulusInstanceMetadata());
  }, [dispatch, executionArnParam]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!execution) {
    return (
      <section className="page__section page__section__header-wrapper">
        {recordUrl &&
          <button
            className="form-group__element--right button button--small button--download"
            onClick={handleDownloadClick}>
            Download Execution
          </button>}
        {error && <ErrorReport report={error} />}
      </section>);
  }

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

  function handleDownloadClick(e) {
    handleDownloadUrlClick(e, { url: recordUrl });
  }

  return (
    <div className="page__component">
      <Helmet>
        <title> Execution Status </title>
      </Helmet>
      <section className="page__section page__section__controls">
        <Breadcrumbs config={breadcrumbConfig} />
      </section>
      <section className="page__section page__section__header-wrapper">
        <div className="page__section__header">
          <h1 className="heading--large heading--shared-content with-description width--three-quarters">
            Execution: {name}
          </h1>
          {recordUrl &&
            <button
              className="form-group__element--right button button--small button--download"
              onClick={handleDownloadClick}>
              Download Execution
            </button>}
          {error && <ErrorReport report={error} />}
        </div>
      </section>

      {/* stateMachine's definition and executionHistory's event statuses are needed to draw the graph */}
      {stateMachine && executionHistory && (
        <section className="page__section">
          <div className="heading__wrapper--border">
            <h2 className="heading--medium">Visual</h2>
          </div>
          <ExecutionStatusGraph executionStatus={recordData} />
        </section>
      )}

      <section className="page__section">
        <div className="heading__wrapper--border">
          <h2 className="heading--medium">
            <span>Details</span>
            <span className="float-right">
              <Link
                className="button button--small button--events"
                to={() => ({
                  pathname: `/executions/execution/${executionArn}/events`,
                })}
              >
                Events
              </Link>
            </span>
          </h2>
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
        <div className="heading__wrapper--border">
          <h2 className="heading--medium">Associated Granules</h2>
        </div>
        <List
          data={execution.granules}
          hideActions={true}
          rowId="granuleId"
          tableColumns={associatedGranulesTableColumns}
          useSimplePagination={true}
        />
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
