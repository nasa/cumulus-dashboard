'use strict';
import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import {
  interval,
  getGranule,
  reingestGranule,
  removeGranule,
  deleteGranule
} from '../../actions';
import { get } from 'object-path';
import {
  displayCase,
  lastUpdated,
  seconds,
  nullValue,
  bool,
  collectionLink
} from '../../utils/format';
import SortableTable from '../table/sortable';
import Loading from '../app/loading-indicator';
import LogViewer from '../logs/viewer';
import ErrorReport from '../errors/report';
import Metadata from '../table/metadata';
import AsyncCommands from '../form/dropdown-async-command';
import { updateInterval } from '../../config';

const tableHeader = [
  'Filename',
  'Original',
  'Staging',
  'Archive',
  'Access'
];

const link = 'Link';
const tableRow = [
  (d) => d.name || '(No name)',
  (d) => (<a href={d.sipFile}>{d.sipFile ? link : nullValue}</a>),
  (d) => (<a href={d.stagingFile}>{d.stagingFile ? link : nullValue}</a>),
  (d) => (<a href={d.archivedFile}>{d.archivedFile ? link : nullValue}</a>),
  (d) => d.access
];

const metaAccessors = [
  ['Status', 'status', displayCase],
  ['PDR Name', 'pdrName', (d) => d ? <Link to={`pdrs/pdr/${d}`}>{d}</Link> : nullValue],
  ['Collection', 'collectionId', collectionLink],
  ['Provider', 'provider', (d) => d ? <Link to={`providers/provider/${d}`}>{d}</Link> : nullValue],
  ['CMR Link', 'cmrLink', (d) => d ? <a href={d}>Link</a> : nullValue],
  ['Published', 'published', bool],
  ['Duplicate', 'hasDuplicate', bool],
  ['Total duration', 'duration', seconds]
];

const granuleErrors = {
  ingest: 'This granule failed during the ingest phase',
  processing: 'This granule failed during the processing phase'
};

var GranuleOverview = React.createClass({
  displayName: 'Granule',

  propTypes: {
    params: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    granules: React.PropTypes.object,
    logs: React.PropTypes.object,
    router: React.PropTypes.object
  },

  componentWillMount: function () {
    const { granuleId } = this.props.params;
    const immediate = !this.props.granules.map[granuleId];
    this.reload(immediate);
  },

  componentWillUnmount: function () {
    if (this.cancelInterval) { this.cancelInterval(); }
  },

  reload: function (immediate, timeout) {
    timeout = timeout || updateInterval;
    const granuleId = this.props.params.granuleId;
    const { dispatch } = this.props;
    if (this.cancelInterval) { this.cancelInterval(); }
    this.cancelInterval = interval(() => dispatch(getGranule(granuleId)), timeout, immediate);
  },

  fastReload: function () {
    // decrease timeout to better see updates
    this.reload(true, updateInterval / 2);
  },

  navigateBack: function () {
    const { router } = this.props;
    router.push('/granules');
  },

  reingest: function () {
    const { granuleId } = this.props.params;
    this.props.dispatch(reingestGranule(granuleId));
  },

  remove: function () {
    const { granuleId } = this.props.params;
    this.props.dispatch(removeGranule(granuleId));
  },

  delete: function () {
    const { granuleId } = this.props.params;
    this.props.dispatch(deleteGranule(granuleId));
  },

  errors: function () {
    const granuleId = this.props.params.granuleId;
    return [
      get(this.props.granules.map, [granuleId, 'error']),
      get(this.props.granules.reprocessed, [granuleId, 'error']),
      get(this.props.granules.reingested, [granuleId, 'error']),
      get(this.props.granules.removed, [granuleId, 'error']),
      get(this.props.granules.deleted, [granuleId, 'error'])
    ].filter(Boolean);
  },

  render: function () {
    const granuleId = this.props.params.granuleId;
    const record = this.props.granules.map[granuleId];

    if (!record || (record.inflight && !record.data)) {
      return <Loading />;
    }
    const granule = record.data;
    const files = [];
    if (granule.files) {
      for (let key in get(granule, 'files', {})) { files.push(granule.files[key]); }
    }
    const logsQuery = { 'meta.granuleId': granuleId };
    const errors = this.errors();
    const granuleError = granule.error;
    const dropdownConfig = [{
      text: 'Reingest',
      action: this.reingest,
      status: get(this.props.granules.reingested, [granuleId, 'status']),
      success: this.fastReload
    }, {
      text: 'Remove from CMR',
      action: this.remove,
      status: get(this.props.granules.removed, [granuleId, 'status']),
      success: this.fastReload
    }, {
      text: 'Delete',
      action: this.delete,
      disabled: granule.published,
      status: get(this.props.granules.deleted, [granuleId, 'status']),
      success: this.navigateBack
    }];

    const granuleErrorType = granuleError && granule.errorType && granuleErrors[granule.errorType]
      ? granuleErrors[granule.errorType] : null;
    return (
      <div className='page__component'>
        <section className='page__section page__section__header-wrapper'>
          <h1 className='heading--large heading--shared-content with-description'>{granuleId}</h1>
          <AsyncCommands config={dropdownConfig} />
          {lastUpdated(granule.timestamp)}
          {granuleError ? <ErrorReport report={granuleError} /> : null}
          {granuleErrorType ? <ErrorReport report={granuleErrorType} /> : null}
        </section>

        <section className='page__section'>
          {errors.length ? errors.map((error, i) => <ErrorReport key={i} report={error} />) : null}
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium with-description'>Granule Overview</h2>
          </div>
          <Metadata data={granule} accessors={metaAccessors} />
        </section>

        <section className='page__section'>
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium heading--shared-content with-description'>Files</h2>
          </div>
          <SortableTable
            data={files}
            header={tableHeader}
            row={tableRow}
            props={['name', 'sipFile', 'stagingFile', 'archivedFile', 'access']}
          />
        </section>

        <section className='page__section'>
          <LogViewer
            query={logsQuery}
            dispatch={this.props.dispatch}
            logs={this.props.logs}
            notFound={`No recent logs for ${granuleId}`}
          />
        </section>
      </div>
    );
  }
});

export default connect(state => state)(GranuleOverview);
