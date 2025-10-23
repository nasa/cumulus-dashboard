/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import path from 'path';
import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { get } from 'object-path';
import pick from 'lodash/pick';
import {
  getGranule,
  getGranuleRecoveryStatus,
  listExecutionsByGranule,
  reingestGranule,
  removeGranule,
  deleteGranule,
  applyWorkflowToGranule,
  listWorkflows,
} from '../../actions';
import {
  displayCase,
  IndicatorWithTooltip,
  lastUpdated,
  seconds,
  nullValue,
  bool,
  collectionLink,
  providerLink,
  pdrLink,
  removeFromCmr,
  deleteText,
} from '../../utils/format';
import Table from '../SortableTable/SortableTable';
import Loading from '../LoadingIndicator/loading-indicator';
import LogViewer from '../Logs/viewer';
import ErrorReport from '../Errors/report';
import Metadata from '../Table/Metadata';
import DropdownAsync from '../DropDown/dropdown-async-command';
import SimpleDropdown from '../DropDown/simple-dropdown';
import { strings } from '../locale';
import { workflowOptionNames } from '../../selectors';
import { defaultWorkflowMeta, executeDialog } from '../../utils/table-config/granules';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import { historyPushWithQueryParams } from '../../utils/url-helper';
import { getGranuleRecoveryJobStatusFromRecord } from '../../utils/recovery-status';

const link = 'Link';
const makeLink = (bucket, key) => `https://${bucket}.s3.amazonaws.com/${key}`;

const tableColumns = [
  {
    Header: 'Filename',
    accessor: (row) => row.fileName || '(No name)',
    id: 'fileName',
  },
  {
    Header: 'Link',
    accessor: (row) => (row.bucket && row.key
      ? (
      <a href={makeLink(row.bucket, row.key)}>
        {row.fileName ? link : nullValue}
      </a>
        )
      : null),
    id: 'link',
  },
  {
    Header: 'File Size (bytes)',
    accessor: (row) => row.size || '(No Size Found)',
    id: 'size'
  },
  {
    Header: 'Bucket',
    accessor: 'bucket',
  },
];

const metaAccessors = [
  {
    label: 'PDR Name',
    property: 'pdrName',
    accessor: pdrLink,
  },
  {
    label: 'Collection',
    property: 'collectionId',
    accessor: collectionLink,
  },
  {
    label: 'Provider',
    property: 'provider',
    accessor: providerLink,
  },
  {
    label: `${strings.cmr} Link`,
    property: 'cmrLink',
    accessor: (d) => (d
      ? (
      <a href={d} target="_blank">
        link
      </a>
        )
      : (
          nullValue
        )),
  },
  {
    label: 'Executions List',
    accessor: (row) => (row.granuleId && row.collectionId
      ? (
        <Link to={`/executions/executions-list/${encodeURIComponent(row.collectionId)}/${encodeURIComponent(path.basename(row.granuleId))}`}>link</Link>
        )
      : (
          nullValue
        )),
  },
  {
    label: 'Published',
    property: 'published',
    accessor: bool,
  },
  {
    label: 'Producer Granule ID',
    property: 'producerGranuleId',
  },
  {
    label: 'Total duration',
    property: 'duration',
    accessor: seconds,
  },
];

function GranuleOverview({ skipReloadOnMount = false }) {
  const { granuleId } = useParams();
  const dispatch = useDispatch();

  const [showRecoveryStatus, setShowRecoveryStatus] = useState(false);
  const [reingestWorkflow, setReingestWorkflow] = useState({});
  const [workflow, setWorkflow] = useState(undefined);
  const [workflowMeta, setWorkflowMeta] = useState(defaultWorkflowMeta);

  const granules = useSelector((state) => state.granules);
  const executions = useSelector((state) => state.executions);
  const config = useSelector((state) => state.config);
  const recoveryStatusMap = useSelector((state) => state.recoveryStatus.map);
  const workflowOptions = useSelector(workflowOptionNames);

  const granuleRecord = granules.map[granuleId];
  const granule = granuleRecord?.data;

  useEffect(() => {
    dispatch(listWorkflows());
    if (!skipReloadOnMount) {
      loadGranule();
    }
  }, [dispatch, skipReloadOnMount]);

  useEffect(() => {
    if (workflowOptions?.length) {
      setWorkflow(workflowOptions[0]);
    }
  }, [workflowOptions]);

  const loadGranule = useCallback(() => {
    dispatch(getGranule(granuleId)).then((granuleResponse) => {
      const payload = { granules: [pick(granuleResponse.data, ['granuleId', 'collectionId'])] };
      dispatch(listExecutionsByGranule(granuleId, payload, false));
    });
  }, [dispatch, granuleId]);

  const navigateBack = () => {
    historyPushWithQueryParams('/granules');
  };

  const toggleShowRecoveryStatus = () => {
    const collectionId = get(granules.map, [granuleId, 'data', 'collectionId']);
    const newState = !showRecoveryStatus;
    setShowRecoveryStatus(newState);
    if (newState) {
      dispatch(getGranuleRecoveryStatus(granuleId, collectionId));
    }
  };

  const reingest = () => {
    dispatch(reingestGranule(granuleId, { executionArn: reingestWorkflow.value }));
  };

  const applyWorkflow = () => {
    const { meta } = JSON.parse(workflowMeta);
    setWorkflowMeta(defaultWorkflowMeta);
    dispatch(applyWorkflowToGranule(granuleId, workflow, meta));
  };

  const remove = () => {
    dispatch(removeGranule(granuleId));
  };

  const deleteGranuleFn = () => {
    dispatch(deleteGranule(granuleId));
  };

  const getExecuteOptions = () => [
    executeDialog({
      selectHandler: setWorkflow,
      label: 'workflow',
      value: workflow,
      options: workflowOptions,
      initialMeta: workflowMeta,
      metaHandler: setWorkflowMeta,
    }),
  ];

  const getReingestOptions = () => {
    const granuleExecutions = executions.map?.[granuleId] || {};
    const { data: granuleExecutionsList = [], error } = granuleExecutions;
    const reingestExecutionOptions = granuleExecutionsList.map((execution) => ({
      label: `${execution.type}${execution.arn === granuleExecutionsList[0]?.arn ? ' (default)' : ''}`,
      value: execution.arn,
    }));

    return [(
      <>
        <div className="granule--reingest">
          <p>Selected Granule: <strong>{granuleId}</strong></p>
          <p><strong>To complete your granule reingest requests:</strong></p>
          <p>
            Below you can select a specific workflow to apply to this selected granule.
            <strong> Note: The default is the latest workflow.</strong>
          </p>
          {error && <ErrorReport report={`Failed to get granule executions: ${error}`} />}
        </div>
        <div>
          <SimpleDropdown
            isClearable
            key='workflow-dropdown'
            label='Select Workflow'
            value={reingestWorkflow.label}
            options={reingestExecutionOptions}
            id='workflow-dropdown'
            onChange={(selector, value, option) => setReingestWorkflow(option || {})}
            placeholder='Workflow Name'
          />
        </div>
      </>
    )];
  };

  const errors = [
    get(granules.map, [granuleId, 'error']),
    get(granules.reprocessed, [granuleId, 'error']),
    get(granules.reingested, [granuleId, 'error']),
    get(granules.executed, [granuleId, 'error']),
    get(granules.removed, [granuleId, 'error']),
    get(granules.deleted, [granuleId, 'error']),
    get(recoveryStatusMap, [granuleId, 'error']),
  ].filter(Boolean);

  if (!granuleRecord || (granuleRecord.inflight && !granule)) return <Loading />;
  if (granuleRecord.error) return <ErrorReport report={granuleRecord.error} />;

  const files = Object.values(granule?.files || {});
  const enableRecovery = get(config, 'enableRecovery', false);
  const showHideRecoveryStatusText = showRecoveryStatus ? 'Hide Recovery Status' : 'Show Recovery Status';
  const recoveryStatus = getGranuleRecoveryJobStatusFromRecord(get(recoveryStatusMap, [granuleId, 'data']));

  const dropdownConfig = [
    {
      text: 'Reingest',
      action: reingest,
      status: get(granules.reingested, [granuleId, 'status']),
      success: loadGranule,
      confirmAction: true,
      confirmOptions: getReingestOptions(),
    },
    {
      text: 'Execute',
      action: applyWorkflow,
      status: get(granules.executed, [granuleId, 'status']),
      success: loadGranule,
      confirmAction: true,
      confirmText: `Execute on ${granuleId}?`,
      confirmOptions: getExecuteOptions(),
    },
    {
      text: strings.remove_from_cmr,
      action: remove,
      status: get(granules.removed, [granuleId, 'status']),
      success: loadGranule,
      confirmAction: true,
      confirmText: removeFromCmr(granuleId),
    },
    {
      text: 'Delete',
      action: deleteGranuleFn,
      disabled: !!granule.published,
      status: get(granules.deleted, [granuleId, 'status']),
      success: navigateBack,
      confirmAction: true,
      confirmText: deleteText(granuleId),
    },
  ];

  const breadcrumbConfig = [
    { label: 'Dashboard Home', href: '/' },
    { label: 'Granules', href: '/granules' },
    { label: granuleId, active: true },
  ];

  return (
    <div className="page__component">
      <section className="page__section page__section__controls">
        <Breadcrumbs config={breadcrumbConfig} />
      </section>
      <section className="page__section page__section__header-wrapper">
        <h1 className="heading--large heading--shared-content with-description width--three-quarters">
          {strings.granule}: {granuleId}
        </h1>
        <DropdownAsync config={dropdownConfig} />
        {lastUpdated(granule.createdAt, 'Created')}
        <dl className="status--process">
          <div className="meta__row">
            <dt>Status:</dt>
            <dd>
              <span>Ingest</span>
              <IndicatorWithTooltip granuleId={granuleId} repo='ingest' value={displayCase(granule.status)} className='status-indicator--granule' />
            </dd>
            {(showRecoveryStatus && recoveryStatus)
              ? (
                <dd>
                  <span>Recovery</span>
                  <IndicatorWithTooltip granuleId={granuleId} repo="recovery" value={displayCase(recoveryStatus)} className="status-indicator--granule" />
                </dd>
                )
              : null
            }
            {enableRecovery
              ? (
                  <button
                    className="button button--green button--small button__filter form-group__element--right"
                    onClick={toggleShowRecoveryStatus}>
                    {showHideRecoveryStatusText}
                  </button>
                )
              : null
            }
          </div>
        </dl>
      </section>

      <section className="page__section">
        {errors.length ? <ErrorReport report={errors} /> : null}
        <div className="heading__wrapper--border">
          <h2 className="heading--medium with-description">
            Granule Overview
          </h2>
        </div>
        <Metadata data={granule} accessors={metaAccessors} />
      </section>

      <section className="page__section">
        <div className="heading__wrapper--border">
          <h2 className="heading--medium heading--shared-content with-description">
            Files
          </h2>
        </div>
        <Table data={files} tableColumns={tableColumns} />
      </section>

      <section className="page__section">
        <LogViewer
          query={{ q: granuleId }}
          dispatch={dispatch}
          notFound={`No recent logs for ${granuleId}`}
        />
      </section>
    </div>
  );
}

GranuleOverview.propTypes = {
  skipReloadOnMount: PropTypes.bool
};

export default GranuleOverview;
