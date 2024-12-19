/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import path from 'path';
import { get } from 'object-path';
// import isEqual from 'lodash/isEqual';
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
import {
  defaultWorkflowMeta,
  executeDialog,
} from '../../utils/table-config/granules';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import { getGranuleRecoveryJobStatusFromRecord } from '../../utils/recovery-status';
import { withUrlHelper } from '../../withUrlHelper';

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
    id: 'size',
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
        <a href={d} target='_blank'>
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
        <Link to={() => ({ pathname: `/executions/executions-list/${encodeURIComponent(row.collectionId)}/${encodeURIComponent(path.basename(row.granuleId))}` })}>link</Link>
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
    label: 'Duplicate',
    property: 'hasDuplicate',
    accessor: bool,
  },
  {
    label: 'Total duration',
    property: 'duration',
    accessor: seconds,
  },
];

const GranuleOverview = ({ urlHelper }) => {
  const { granuleId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { historyPushWithQueryParams } = urlHelper;

  const granules = useSelector((state) => state.granules);
  const executions = useSelector((state) => state.executions);
  const logs = useSelector((state) => state.logs);
  const recoveryStatus = useSelector((state) => state.recoveryStatus);
  const config = useSelector((state) => state.config);
  const workflowOptions = useSelector((state) => workflowOptionNames(state));

  const [showRecoveryStatus, setShowRecoveryStatus] = useState(false);
  const [reingestWorkflow, setReingestWorkflow] = useState({});
  const [workflow, setWorkflow] = useState(workflowOptions[0]);
  const [workflowMeta, setWorkflowMeta] = useState(defaultWorkflowMeta);

  const errors = useMemo(() => [
    get(granules.map, [granuleId, 'error']),
    get(granules.reprocessed, [granuleId, 'error']),
    get(granules.reingested, [granuleId, 'error']),
    get(granules.executed, [granuleId, 'error']),
    get(granules.removed, [granuleId, 'error']),
    get(granules.deleted, [granuleId, 'error']),
    get(recoveryStatus.map, [granuleId, 'error']),
  ].filter(Boolean), [granules, recoveryStatus, granuleId]);

  const selectWorkflow = useCallback(() => {
    setWorkflow({ workflow });
  }, [workflow]);

  const setWorkflowMetaValue = useCallback(() => {
    setWorkflowMeta({ workflowMeta });
  }, [workflowMeta]);

  const loadGranule = useCallback(() => {
    dispatch(getGranule(granuleId)).then((granuleResponse) => {
      const payload = {
        granules: [pick(granuleResponse.data, ['granuleId', 'collectionId'])],
      };
      dispatch(listExecutionsByGranule(granuleId, payload));
    });
    dispatch(getGranuleRecoveryStatus(granuleId));
  }, [dispatch, granuleId]);

  const navigateBack = useCallback(() => {
    historyPushWithQueryParams('/granules');
  }, [historyPushWithQueryParams]);

  const deletes = useCallback(() => {
    dispatch(deleteGranule(granuleId)).then(() => {
      navigate('/granules');
    });
  }, [dispatch, granuleId, navigate]);

  const getExecuteOptions = useMemo(() => [
    executeDialog({
      selectHandler: selectWorkflow,
      label: 'workflow',
      value: workflow,
      options: workflowOptions,
      initialMeta: workflowMeta,
      metaHandler: setWorkflowMetaValue,
    }),
  ], [
    workflow,
    workflowMeta,
    workflowOptions,
    selectWorkflow,
    setWorkflowMetaValue,
  ]);

  const getExecuteOptionsCallback = useCallback(() => getExecuteOptions, [getExecuteOptions]);

  useEffect(() => {
    loadGranule();
  }, [loadGranule]);

  useEffect(() => {
    setWorkflow(workflowOptions[0]);
  }, [workflowOptions]);

  useEffect(() => {
    if (granules.error) {
      navigate('/error', { state: { error: granules.error } });
    }
  }, [granules.error, navigate]);

  useEffect(() => {
    const queryWorkflows = async () => {
      try {
        await dispatch(listWorkflows());
        // Do something with the result if needed
      } catch (error) {
        // Handle any errors
        console.error('Failed to fetch workflows:', error);
      }
    };
    queryWorkflows();
  }, [dispatch]);

  // Early return for loading state
  if (!granules.map[granuleId]) {
    return <Loading />;
  }

  const reingest = () => {
    dispatch(
      reingestGranule(granuleId, { executionArn: reingestWorkflow.value })
    );
  };

  const applyWorkflow = () => {
    const { meta } = JSON.parse(workflowMeta);
    setWorkflowMeta(defaultWorkflowMeta);
    dispatch(applyWorkflowToGranule(granuleId, workflow, meta));
  };

  const remove = () => {
    dispatch(removeGranule(granuleId));
  };

  const granuleRecoveryStatus = getGranuleRecoveryJobStatusFromRecord(
    get(recoveryStatus.map, [granuleId, 'data'])
  );

  const toggleShowRecoveryStatus = () => {
    const collectionId = granules.map[(granuleId, 'data', 'collectionId')];
    const newShowRecoveryStatus = !showRecoveryStatus;
    setShowRecoveryStatus(newShowRecoveryStatus);
    if (newShowRecoveryStatus) {
      dispatch(getGranuleRecoveryStatus(granuleId, collectionId));
    } else {
      console.error(`Granule data not found for granuleId: ${granuleId}`);
    }
  };

  const selectReingestWorkflow = (selector, value, option) => {
    setReingestWorkflow({ reingestWorkflow: option || {} });
  };

  const getReingestOptions = () => {
    const granuleExecutions = executions.map?.[granuleId] || {};
    const { data: granuleExecutionsList = [], error } = granuleExecutions || {};
    const reingestExecutionOptions = granuleExecutionsList.map((execution) => ({
      label: `${execution.type}${
        execution.arn === granuleExecutionsList[0].arn ? ' (default)' : ''
      }`,
      value: execution.arn,
    }));

    return [
      <>
        <div className='granule--reingest'>
          <p>
            Selected Granule: <strong>{granuleId}</strong>
          </p>
          <p>
            <strong>To complete your granule reingest requests:</strong>
          </p>
          <p>
            Below you can select a specific workflow to apply to this selected
            granule.
            <strong>Note: The default is the latest workflow.</strong>
          </p>
          {error && (
            <ErrorReport
              report={`Failed to get granule executions: ${error}`}
            />
          )}
        </div>
        <div>
          <SimpleDropdown
            isClearable={true}
            key={'workflow-dropdown'}
            label={'Select Workflow'}
            value={reingestWorkflow.label}
            options={reingestExecutionOptions}
            id='workflow-dropdown'
            onChange={selectReingestWorkflow}
            placeholder='Workflow Name'
          />
        </div>
      </>,
    ];
  };

  const record = granules.map[granuleId];
  if (!record || (record.inflight && !record.data)) {
    return <Loading />;
  }
  if (record.error) {
    return <ErrorReport report={record.error} />;
  }

  const granule = record.data;
  const files = [];
  if (granule.files) {
    for (const key in get(granule, 'files', {})) {
      files.push(granule.files[key]);
    }
  }

  const enableRecovery = get(config, 'enableRecovery', false);

  const showHideRecoveryStatusText = showRecoveryStatus
    ? 'Hide Recovery Status'
    : 'Show Recovery Status';

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
      confirmOptions: getExecuteOptionsCallback(),
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
      action: deletes,
      disabled: !!granule.published,
      status: get(granules.deleted, [granuleId, 'status']),
      success: navigateBack,
      confirmAction: true,
      confirmText: deleteText(granuleId),
    },
  ];

  const breadcrumbConfig = [
    {
      label: 'Dashboard Home',
      href: '/',
    },
    {
      label: 'Granules',
      href: '/granules',
    },
    {
      label: granuleId,
      active: true,
    },
  ];

  return (
    <div className='page__component'>
      <section className='page__section page__section__controls'>
        <Breadcrumbs config={breadcrumbConfig} />
      </section>
      <section className='page__section page__section__header-wrapper'>
        <h1 className='heading--large heading--shared-content with-description width--three-quarters'>
          {strings.granule}: {granuleId}
        </h1>
        <DropdownAsync config={dropdownConfig} />
        {lastUpdated(granule.createdAt, 'Created')}

        <dl className='status--process'>
          <div className='meta__row'>
            <dt>Status:</dt>
            <dd>
              <span>Ingest</span>
              <IndicatorWithTooltip
                granuleId={granuleId}
                repo='ingest'
                value={displayCase(granule.status)}
                className='status-indicator--granule'
              />
            </dd>
            {(showRecoveryStatus && granuleRecoveryStatus)
              ? <dd>
                  <span>Recovery</span>
                  <IndicatorWithTooltip
                    granuleId={granuleId}
                    repo='recovery'
                    value={displayCase(granuleRecoveryStatus)}
                    className='status-indicator--granule'
                  />
                </dd>
              : null
            }
            {enableRecovery
              ? <button
                className='button button--green button--small button__filter form-group__element--right'
                onClick={toggleShowRecoveryStatus}
              >
                {showHideRecoveryStatusText}
              </button>
              : null
            }
          </div>
        </dl>
      </section>

      <section className='page__section'>
        {errors.length ? <ErrorReport report={errors} /> : null}
        <div className='heading__wrapper--border'>
          <h2 className='heading--medium with-description'>Granule Overview</h2>
        </div>
        <Metadata data={granule} accessors={metaAccessors} />
      </section>

      <section className='page__section'>
        <div className='heading__wrapper--border'>
          <h2 className='heading--medium heading--shared-content with-description'>
            Files
          </h2>
        </div>
        <Table data={files} tableColumns={tableColumns} />
      </section>

      <section className='page__section'>
        <LogViewer
          query={{ q: granuleId }}
          dispatch={logs}
          notFound={`No recent logs for ${granuleId}`}
        />
      </section>
    </div>
  );
};

GranuleOverview.propTypes = {
  config: PropTypes.object,
  match: PropTypes.object,
  dispatch: PropTypes.func,
  granules: PropTypes.object,
  executions: PropTypes.object,
  logs: PropTypes.object,
  recoveryStatus: PropTypes.object,
  skipReloadOnMount: PropTypes.bool,
  workflowOptions: PropTypes.array,
  urlHelper: PropTypes.shape({
    historyPushWithQueryParams: PropTypes.func,
  }),
};

GranuleOverview.defaultProps = {
  skipReloadOnMount: false,
};

GranuleOverview.displayName = strings.granule;

export { GranuleOverview };

export default withUrlHelper(GranuleOverview);
