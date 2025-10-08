import React, { useEffect, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { getExecutionLogs } from '../../actions';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import ErrorReport from '../Errors/report';

const ExecutionLogs = () => {
  const { executionArn } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();

  const executionName = useMemo(
    () => (executionArn ? executionArn.split(':').pop() : ''),
    [executionArn]
  );

  const executionLogs = useSelector((state) => state.executionLogs);

  useEffect(() => {
    if (executionName) {
      dispatch(getExecutionLogs(executionName));
    }
  }, [dispatch, executionName]);

  const navigateBack = useCallback(() => {
    history.push('/executions');
  }, [history]);

  const errors = () => [];

  const breadcrumbConfig = [
    {
      label: 'Dashboard Home',
      href: '/',
    },
    {
      label: 'Executions',
      href: '/executions',
    },
    {
      label: 'Execution Logs',
      active: true,
    },
  ];

  if (!executionLogs.results) return null;

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
};

ExecutionLogs.displayName = 'Execution Logs';

export default ExecutionLogs;
