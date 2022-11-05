/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import path from 'path';
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { get } from 'object-path';
import isEqual from 'lodash/isEqual';
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

class GranuleOverview extends React.Component {
  constructor(props) {
    super(props);
    this.loadGranule = this.loadGranule.bind(this);
    this.navigateBack = this.navigateBack.bind(this);
    this.queryWorkflows = this.queryWorkflows.bind(this);
    this.reingest = this.reingest.bind(this);
    this.applyWorkflow = this.applyWorkflow.bind(this);
    this.toggleShowRecoveryStatus = this.toggleShowRecoveryStatus.bind(this);
    this.remove = this.remove.bind(this);
    this.delete = this.delete.bind(this);
    this.errors = this.errors.bind(this);
    this.selectReingestWorkflow = this.selectReingestWorkflow.bind(this);
    this.selectWorkflow = this.selectWorkflow.bind(this);
    this.getExecuteOptions = this.getExecuteOptions.bind(this);
    this.setWorkflowMeta = this.setWorkflowMeta.bind(this);
    this.state = {
      showRecoveryStatus: false,
      reingestWorkflow: {},
      workflow: this.props.workflowOptions[0],
      workflowMeta: defaultWorkflowMeta,
    };
  }

  componentDidMount() {
    this.queryWorkflows();
    if (this.props.skipReloadOnMount) return;
    this.loadGranule();
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.workflowOptions, this.props.workflowOptions)) {
      this.setState({ workflow: this.props.workflowOptions[0] });
    }
  }

  loadGranule() {
    const { dispatch, match } = this.props;
    const { granuleId } = match.params;
    dispatch(getGranule(granuleId))
      .then((granuleResponse) => {
        const payload = { granules: [pick(granuleResponse.data, ['granuleId', 'collectionId'])] };
        dispatch(listExecutionsByGranule(granuleId, payload));
      });
  }

  navigateBack() {
    historyPushWithQueryParams('/granules');
  }

  queryWorkflows() {
    this.props.dispatch(listWorkflows());
  }

  reingest() {
    const { granuleId } = this.props.match.params;
    this.props.dispatch(reingestGranule(granuleId, { executionArn: this.state.reingestWorkflow.value }));
  }

  applyWorkflow() {
    const { granuleId } = this.props.match.params;
    const { workflow, workflowMeta } = this.state;
    const { meta } = JSON.parse(workflowMeta);
    this.setState({ workflowMeta: defaultWorkflowMeta });
    this.props.dispatch(applyWorkflowToGranule(granuleId, workflow, meta));
  }

  remove() {
    const { granuleId } = this.props.match.params;
    this.props.dispatch(removeGranule(granuleId));
  }

  delete() {
    const { granuleId } = this.props.match.params;
    this.props.dispatch(deleteGranule(granuleId));
  }

  toggleShowRecoveryStatus() {
    const { granuleId } = this.props.match.params;
    const newState = !this.state.showRecoveryStatus;
    this.setState({ showRecoveryStatus: newState });
    if (newState) {
      this.props.dispatch(getGranuleRecoveryStatus(granuleId));
    }
  }

  errors() {
    const { granuleId } = this.props.match.params;
    return [
      get(this.props.granules.map, [granuleId, 'error']),
      get(this.props.granules.reprocessed, [granuleId, 'error']),
      get(this.props.granules.reingested, [granuleId, 'error']),
      get(this.props.granules.executed, [granuleId, 'error']),
      get(this.props.granules.removed, [granuleId, 'error']),
      get(this.props.granules.deleted, [granuleId, 'error']),
      get(this.props.recoveryStatus.map, [granuleId, 'error']),
    ].filter(Boolean);
  }

  selectReingestWorkflow(selector, value, option) {
    this.setState({ reingestWorkflow: option || {} });
  }

  selectWorkflow(selector, workflow) {
    this.setState({ workflow });
  }

  setWorkflowMeta(workflowMeta) {
    this.setState({ workflowMeta });
  }

  getExecuteOptions() {
    return [
      executeDialog({
        selectHandler: this.selectWorkflow,
        label: 'workflow',
        value: this.state.workflow,
        options: this.props.workflowOptions,
        initialMeta: this.state.workflowMeta,
        metaHandler: this.setWorkflowMeta,
      }),
    ];
  }

  getReingestOptions() {
    const { match, executions } = this.props;
    const { granuleId } = match.params;
    const granuleExecutions = executions.map?.[granuleId] || {};
    const { data: granuleExecutionsList = [], error } = granuleExecutions || {};
    const reingestExecutionOptions = granuleExecutionsList
      .map((execution) => ({
        label: `${execution.type}${(execution.arn === granuleExecutionsList[0].arn) ? ' (default)' : ''}`,
        value: execution.arn
      }));

    return [(
      <>
        <div className="granule--reingest">
          <p>Selected Granule: <strong>{granuleId}</strong></p>
          <p><strong>To complete your granule reingest requests:</strong></p>
          <p>
            Below you can select a specific workflow to apply to this selected granule.
            <strong>Note: The default is the latest workflow.</strong>
          </p>
          {error &&
            <ErrorReport report={`Failed to get granule executions: ${error}`} />}
        </div>
        <div>
          <SimpleDropdown
            isClearable={true}
            key={'workflow-dropdown'}
            label={'Select Workflow'}
            value={this.state.reingestWorkflow.label}
            options={reingestExecutionOptions}
            id='workflow-dropdown'
            onChange={this.selectReingestWorkflow}
            placeholder="Workflow Name"
          />
        </div>
      </>
    )];
  }

  render() {
    const { granuleId } = this.props.match.params;
    const record = this.props.granules.map[granuleId];
    if (!record || (record.inflight && !record.data)) {
      return <Loading />;
    } if (record.error) {
      return <ErrorReport report={record.error} />;
    }

    const granule = record.data;
    const files = [];
    if (granule.files) {
      for (const key in get(granule, 'files', {})) {
        files.push(granule.files[key]);
      }
    }

    const enableRecovery = get(this.props.config, 'enableRecovery', false);
    const showHideRecoveryStatusText = this.state.showRecoveryStatus
      ? 'Hide Recovery Status'
      : 'Show Recovery Status';
    const recoveryStatus = getGranuleRecoveryJobStatusFromRecord(get(this.props.recoveryStatus.map, [granuleId, 'data']));

    const dropdownConfig = [
      {
        text: 'Reingest',
        action: this.reingest,
        status: get(this.props.granules.reingested, [granuleId, 'status']),
        success: this.loadGranule,
        confirmAction: true,
        confirmOptions: this.getReingestOptions(),
      },
      {
        text: 'Execute',
        action: this.applyWorkflow,
        status: get(this.props.granules.executed, [granuleId, 'status']),
        success: this.loadGranule,
        confirmAction: true,
        confirmText: `Execute on ${granuleId}?`,
        confirmOptions: this.getExecuteOptions(),
      },
      {
        text: strings.remove_from_cmr,
        action: this.remove,
        status: get(this.props.granules.removed, [granuleId, 'status']),
        success: this.loadGranule,
        confirmAction: true,
        confirmText: removeFromCmr(granuleId),
      },
      {
        text: 'Delete',
        action: this.delete,
        disabled: !!granule.published,
        status: get(this.props.granules.deleted, [granuleId, 'status']),
        success: this.navigateBack,
        confirmAction: true,
        confirmText: deleteText(granuleId),
      },
    ];
    const errors = this.errors();

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
              {(this.state.showRecoveryStatus && recoveryStatus)
                ? <dd>
                  <span>Recovery</span>
                  <IndicatorWithTooltip granuleId={granuleId} repo='recovery' value={displayCase(recoveryStatus)} className='status-indicator--granule' />
                </dd>
                : null
              }
              {enableRecovery
                ? <button
                  className="button button--green button--small button__filter form-group__element--right"
                  onClick={this.toggleShowRecoveryStatus}>
                  {showHideRecoveryStatusText}
                </button>
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
            dispatch={this.props.dispatch}
            notFound={`No recent logs for ${granuleId}`}
          />
        </section>
      </div>
    );
  }
}

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
};

GranuleOverview.defaultProps = {
  skipReloadOnMount: false,
};

GranuleOverview.displayName = strings.granule;

export { GranuleOverview };

export default withRouter(
  connect((state) => ({
    config: state.config,
    granules: state.granules,
    executions: state.executions,
    recoveryStatus: state.recoveryStatus,
    workflowOptions: workflowOptionNames(state),
    logs: state.logs,
  }))(GranuleOverview)
);
