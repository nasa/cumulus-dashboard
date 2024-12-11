import React, { useEffect, useCallback, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import { listExecutionsByGranule } from '../../actions';
import { tableColumns } from '../../utils/table-config/executions-list';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import List from '../Table/Table';
import ExecutionSnapshot from './execution-snapshot';

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
    label: 'Executions List',
    active: true
  }
];

const ExecutionsList = () => {
  const { collectionId, granuleId } = useParams();
  const dispatch = useDispatch();
  const executions = useSelector((state) => state.executions);

  console.log('Route params:', { collectionId, granuleId });

  const { map } = executions || {};
  const granuleExecutionslist = map[granuleId] || {};
  const { meta } = granuleExecutionslist;

  const payload = useMemo(() => ({
    granules: [
      {
        granuleId: granuleId ? decodeURIComponent(granuleId) : '',
        collectionId: collectionId ? decodeURIComponent(collectionId) : ''
      }
    ],
  }), [granuleId, collectionId]);

  // Initial data fetch
  useEffect(() => {
    if (granuleId && collectionId) {
      dispatch(listExecutionsByGranule(granuleId, payload));
    }
  }, [dispatch, granuleId, collectionId, payload]);

  const renderRowSubComponent = useCallback((row) => {
    <ExecutionSnapshot row={row} />;
  }, []);
  // If there are no params, show error
  if (!granuleId || !collectionId) {
    return <div>Error: Missing granuleId or collectionId</div>;
  }

  return (
    <div className='page__component'>
      <Helmet>
        <title> Executions for {granuleId} </title>
      </Helmet>
      <section className='page__section page__section__header-wrapper'>
        <section className="page__section page__section__controls">
          <Breadcrumbs config={breadcrumbConfig} />
        </section>
        <h1 className='heading--large heading--shared-content with-description with-bottom-border width--full'>
          Executions for <Link to={`/granules/granule/${granuleId}`}>{granuleId}</Link>
        </h1>
        <p className='with-description'>
          Here you will see the full list of executions for this granule.
          You can click on each execution for visual step flow, details, and events.
          The newly added failed events snapshot gives you a quick reference of where
          the error is for a failed execution.
        </p>
        <section className="page__section">
          <div className="heading__wrapper--border">
            <h2 className="heading--medium heading--shared-content with-description">Total Executions
              <span className='num-title'>{meta?.count || 0}</span>
            </h2>
          </div>
          <List
            list={granuleExecutionslist}
            tableColumns={tableColumns}
            action={() => listExecutionsByGranule(granuleId, payload)}
            rowId='name'
            initialSortId='updatedAt'
            renderRowSubComponent={renderRowSubComponent}
          >
          </List>
        </section>
      </section>
    </div>
  );
};

export { ExecutionsList };

export default ExecutionsList;
