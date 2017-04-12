'use strict';
import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import {
  interval,
  getGranule,
  reprocessGranule,
  reingestGranule,
  removeGranule,
  deleteGranule
} from '../../actions';
import { get } from 'object-path';
import { fullDate, lastUpdated, seconds, nullValue, bool } from '../../utils/format';
import SortableTable from '../table/sortable';
import Loading from '../app/loading-indicator';
import LogViewer from '../logs/viewer';
import AsyncCommand from '../form/async-command';
import ErrorReport from '../errors/report';
import Metadata from '../table/metadata';
import { updateInterval, updateDelay } from '../../config';

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
  ['PDR Name', 'pdrName', (d) => <Link to={`pdrs/pdr/${d}`}>{d}</Link>],
  ['Published', 'published', bool],
  ['Duplicate', 'hasDuplicate', bool],

  ['Created', 'createdAt', fullDate],
  ['Last updated', 'updatedAt', fullDate],

  ['Ingested started', 'ingestStartedAt', fullDate],
  ['Ingest ended', 'ingestEndedAt', fullDate],

  ['CMR push started', 'timeline.pushToCMR.startedAt', fullDate],
  ['CMR push ended', 'timeline.pushToCMR.endedAt', fullDate],

  ['Archive started', 'timeline.archive.startedAt', fullDate],
  ['Archive ended', 'timeline.archive.endedAt', fullDate],

  ['Processing started', 'timeline.processStep.startedAt', fullDate],
  ['Processing ended', 'timeline.processStep.endedAt', fullDate],

  ['Ingest duration', 'ingestDuration', seconds],
  ['CMR Duration', 'pushToCMRDuration', seconds],
  ['Archive duration', 'archiveDuration', seconds],
  ['Processing duration', 'processingDuration', seconds],
  ['Total duration', 'totalDuration', seconds]
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

  reprocess: function () {
    const { granuleId } = this.props.params;
    this.props.dispatch(reprocessGranule(granuleId));
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
    const granule = this.props.granules.map[granuleId].data;
    if (!granule.published) {
      this.props.dispatch(deleteGranule(granuleId));
    }
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

  renderStatus: function (status) {
    const statusList = [
      ['Ingest', 'ingesting'],
      ['Processing', 'processing'],
      ['Pushed to CMR', 'cmr'],
      ['Archiving', 'archiving']
    ];
    if (status === 'failed') statusList.push(['Failed', 'failed']);
    else statusList.push(['Complete', 'completed']);
    const indicatorClass = 'progress-bar__indicator progress-bar__indicator--' + status;
    const statusBarClass = 'progress-bar__progress progress-bar__progress--' + status;
    return (
      <div className='page__section--subsection page__section__granule--progress'>
        <div className='progress-bar'>
          <div className={statusBarClass}></div>

          <div className={indicatorClass}>
            <div className='pulse'>
              <div className='pulse__dot'></div>
              <div className=''></div>
            </div>
          </div>

        </div>
        <ol>
          {statusList.map(d => (
            <li
              className={ d[1] === status ? 'progress-bar__active' : ''}
              key={d[1]}>{d[0]}</li>
          ))}
        </ol>
      </div>

    );
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
    const cmrLink = granule.cmrLink;
    const reprocessStatus = get(this.props.granules.reprocessed, [granuleId, 'status']);
    const reingestStatus = get(this.props.granules.reingested, [granuleId, 'status']);
    const removeStatus = get(this.props.granules.removed, [granuleId, 'status']);
    const deleteStatus = get(this.props.granules.deleted, [granuleId, 'status']);
    const errors = this.errors();
    const granuleError = granule.error;
    const granuleErrorType = granuleError && granule.errorType && granuleErrors[granule.errorType]
      ? granuleErrors[granule.errorType] : null;
    return (
      <div className='page__component'>
        <section className='page__section page__section__header-wrapper'>
          <h1 className='heading--large heading--shared-content with-description'>{granuleId}</h1>

          <AsyncCommand action={this.delete}
            success={this.navigateBack}
            successTimeout={updateDelay}
            status={deleteStatus}
            disabled={granule.published}
            className={'form-group__element--right'}
            text={deleteStatus === 'success' ? 'Deleted!' : 'Delete'} />

          <AsyncCommand action={this.remove}
            success={this.fastReload}
            successTimeout={updateDelay}
            status={removeStatus}
            disabled={!granule.published}
            className={'form-group__element--right'}
            text={'Remove from CMR'} />

          <AsyncCommand action={this.reingest}
            success={this.fastReload}
            successTimeout={updateDelay}
            status={reingestStatus}
            className={'form-group__element--right'}
            text={'Reingest'} />

          <AsyncCommand action={this.reprocess}
            success={this.fastReload}
            successTimeout={updateDelay}
            status={reprocessStatus}
            className={'form-group__element--right'}
            text={'Reprocess'} />

          {lastUpdated(granule.queriedAt)}
          {this.renderStatus(granule.status)}
          {granuleError ? <ErrorReport report={granuleError} /> : null}
          {granuleErrorType ? <ErrorReport report={granuleErrorType} /> : null}
        </section>

        <section className='page__section'>
          {errors.length ? errors.map(error => <ErrorReport report={error} />) : null}
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium with-description'>Granule Overview {cmrLink ? <a href={cmrLink}>[CMR]</a> : null}</h2>
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
          <LogViewer query={logsQuery} dispatch={this.props.dispatch} logs={this.props.logs}/>
        </section>
      </div>
    );
  }
});

export default connect(state => state)(GranuleOverview);
