'use strict';
import path from 'path';
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  interval,
  getGranule,
  reingestGranule,
  removeGranule,
  deleteGranule,
  applyWorkflowToGranule,
  listWorkflows
} from '../../actions';
import { get } from 'object-path';
import {
  displayCase,
  lastUpdated,
  seconds,
  nullValue,
  bool,
  collectionLink,
  providerLink,
  pdrLink,
  deleteText
} from '../../utils/format';
import Table from '../SortableTable/SortableTable';
import Loading from '../LoadingIndicator/loading-indicator';
import LogViewer from '../Logs/viewer';
import ErrorReport from '../Errors/report';
import Metadata from '../Table/Metadata';
import AsyncCommands from '../DropDown/dropdown-async-command';
import _config from '../../config';
import { strings } from '../locale';
import { workflowOptionNames } from '../../selectors';
import { simpleDropdownOption } from '../../utils/table-config/granules';

const { updateInterval } = _config;

const link = 'Link';

const makeLink = (bucket, key) => {
  return `https://${bucket}.s3.amazonaws.com/${key}`;
};

const tableColumns = [
  {
    Header: 'Filename',
    accessor: row => row.fileName || '(No name)',
    id: 'fileName'
  },
  {
    Header: 'Link',
    accessor: row => (row.bucket && row.key) ? (<a href={makeLink(row.bucket, row.key)}>{row.fileName ? link : nullValue}</a>) : null,
    id: 'link'
  },
  {
    Header: 'Bucket',
    accessor: 'bucket'
  }
];

const metaAccessors = [
  ['PDR Name', 'pdrName', pdrLink],
  ['Collection', 'collectionId', collectionLink],
  ['Provider', 'provider', providerLink],
  [`${strings.cmr} Link`, 'cmrLink', (d) => d ? <a href={d} target='_blank'>Link</a> : nullValue],
  ['Execution', 'execution', (d) => d ? <Link to={`/executions/execution/${path.basename(d)}`}>link</Link> : nullValue],
  ['Published', 'published', bool],
  ['Duplicate', 'hasDuplicate', bool],
  ['Total duration', 'duration', seconds]
];

class GranuleOverview extends React.Component {
  constructor () {
    super();
    this.reload = this.reload.bind(this);
    this.fastReload = this.fastReload.bind(this);
    this.navigateBack = this.navigateBack.bind(this);
    this.queryWorkflows = this.queryWorkflows.bind(this);
    this.reingest = this.reingest.bind(this);
    this.applyWorkflow = this.applyWorkflow.bind(this);
    this.remove = this.remove.bind(this);
    this.delete = this.delete.bind(this);
    this.errors = this.errors.bind(this);
    this.selectWorkflow = this.selectWorkflow.bind(this);
    this.getExecuteOptions = this.getExecuteOptions.bind(this);
    this.displayName = strings.granule;
    this.state = {};
  }

  componentDidMount () {
    const { granuleId } = this.props.match.params;
    this.cancelInterval = interval(this.queryWorkflows, updateInterval, true);

    if (this.props.skipReloadOnMount) return;

    const immediate = !this.props.granules.map[granuleId];
    this.reload(immediate);
  }

  componentWillUnmount () {
    if (this.cancelInterval) { this.cancelInterval(); }
  }

  reload (immediate, timeout) {
    timeout = timeout || updateInterval;
    const granuleId = this.props.match.params.granuleId;
    const { dispatch } = this.props;
    if (this.cancelInterval) { this.cancelInterval(); }
    this.cancelInterval = interval(() => dispatch(getGranule(granuleId)), timeout, immediate);
  }

  fastReload () {
    // decrease timeout to better see updates
    this.reload(true, updateInterval / 2);
  }

  navigateBack () {
    const { history } = this.props;
    history.push('/granules');
  }

  queryWorkflows () {
    this.props.dispatch(listWorkflows());
  }

  reingest () {
    const { granuleId } = this.props.match.params;
    this.props.dispatch(reingestGranule(granuleId));
  }

  applyWorkflow () {
    const { granuleId } = this.props.match.params;
    const { workflow } = this.state;
    this.props.dispatch(applyWorkflowToGranule(granuleId, workflow));
  }

  remove () {
    const { granuleId } = this.props.match.params;
    this.props.dispatch(removeGranule(granuleId));
  }

  delete () {
    const { granuleId } = this.props.match.params;
    this.props.dispatch(deleteGranule(granuleId));
  }

  errors () {
    const granuleId = this.props.match.params.granuleId;
    return [
      get(this.props.granules.map, [granuleId, 'error']),
      get(this.props.granules.reprocessed, [granuleId, 'error']),
      get(this.props.granules.reingested, [granuleId, 'error']),
      get(this.props.granules.executed, [granuleId, 'error']),
      get(this.props.granules.removed, [granuleId, 'error']),
      get(this.props.granules.deleted, [granuleId, 'error'])
    ].filter(Boolean);
  }

  selectWorkflow (selector, workflow) {
    this.setState({ workflow });
  }

  getExecuteOptions () {
    return [
      simpleDropdownOption({
        handler: this.selectWorkflow,
        label: 'workflow',
        value: this.state.workflow,
        options: this.props.workflowOptions
      })
    ];
  }

  render () {
    const granuleId = this.props.match.params.granuleId;
    const record = this.props.granules.map[granuleId];
    if (!record || (record.inflight && !record.data)) {
      return <Loading />;
    } else if (record.error) {
      return <ErrorReport report={record.error} />;
    }

    const granule = record.data;
    const files = [];
    if (granule.files) {
      for (let key in get(granule, 'files', {})) { files.push(granule.files[key]); }
    }
    const dropdownConfig = [{
      text: 'Reingest',
      action: this.reingest,
      status: get(this.props.granules.reingested, [granuleId, 'status']),
      success: this.fastReload,
      confirmAction: true,
      confirmText: `Reingest ${granuleId}? Note: the granule files will be overwritten.`
    }, {
      text: 'Execute',
      action: this.applyWorkflow,
      status: get(this.props.granules.executed, [granuleId, 'status']),
      success: this.fastReload,
      confirmAction: true,
      confirmText: `Execute on ${granuleId}?`,
      confirmOptions: this.getExecuteOptions()
    }, {
      text: strings.remove_from_cmr,
      action: this.remove,
      status: get(this.props.granules.removed, [granuleId, 'status']),
      success: this.fastReload
    }, {
      text: 'Delete',
      action: this.delete,
      disabled: !!granule.published,
      status: get(this.props.granules.deleted, [granuleId, 'status']),
      success: this.navigateBack,
      confirmAction: true,
      confirmText: deleteText(granuleId)
    }];
    const errors = this.errors();

    return (
      <div className='page__component'>
        <section className='page__section page__section__header-wrapper'>
          <h1 className='heading--large heading--shared-content with-description width--three-quarters'>{granuleId}</h1>
          <AsyncCommands config={dropdownConfig} />
          {lastUpdated(granule.createdAt, 'Created')}

          <dl className='status--process'>
            <dt>Status:</dt>
            <dd className={granule.status.toLowerCase()}>{displayCase(granule.status)}</dd>
          </dl>
        </section>

        <section className='page__section'>
          {errors.length ? <ErrorReport report={errors} /> : null}
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium with-description'>{strings.granule_overview}</h2>
          </div>
          <Metadata data={granule} accessors={metaAccessors} />
        </section>

        <section className='page__section'>
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium heading--shared-content with-description'>Files</h2>
          </div>
          <Table
            data={files}
            tableColumns={tableColumns}
          />
        </section>

        <section className='page__section'>
          <LogViewer
            query={{q: granuleId}}
            dispatch={this.props.dispatch}
            logs={this.props.logs}
            notFound={`No recent logs for ${granuleId}`}
          />
        </section>
      </div>
    );
  }
}

GranuleOverview.propTypes = {
  match: PropTypes.object,
  dispatch: PropTypes.func,
  granules: PropTypes.object,
  logs: PropTypes.object,
  history: PropTypes.object,
  skipReloadOnMount: PropTypes.bool,
  workflowOptions: PropTypes.array
};

GranuleOverview.defaultProps = {
  skipReloadOnMount: false
};

export { GranuleOverview };

export default withRouter(connect(state => ({
  granules: state.granules,
  workflowOptions: workflowOptionNames(state),
  logs: state.logs
}))(GranuleOverview));
