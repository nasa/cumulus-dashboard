'use strict';
import React from 'react';
import { connect } from 'react-redux';
import {
  interval,
  getGranule,
  reprocessGranule,
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
const noop = x => x;

const metaAccessors = [
  ['PDR Name', 'pdrName', noop],
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
    // delay a reload but shorten the duration
    // this shows the granule as it reprocesses
    this.reload(false, 2000);
  },

  navigateBack: function () {
    // delay the navigation so we can see the success indicator
    const { router } = this.props;
    setTimeout(() => router.push('/granules'), 1000);
  },

  reprocess: function () {
    const { granuleId } = this.props.params;
    this.props.dispatch(reprocessGranule(granuleId));
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
    const errors = [
      get(this.props.granules.map, [granuleId, 'error']),
      get(this.props.granules.reprocessed, [granuleId, 'error']),
      get(this.props.granules.removed, [granuleId, 'error']),
      get(this.props.granules.deleted, [granuleId, 'error'])
    ].filter(Boolean);
    return errors.length ? errors.map(JSON.stringify).join(', ') : null;
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
    return (
      <div className='page__section--subsection page__section__granule--progress'>
        <div className='progress-bar'>

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
    console.log(granule);
    const files = [];
    if (granule.files) {
      for (let key in get(granule, 'files', {})) { files.push(granule.files[key]); }
    }
    const logsQuery = { 'meta.granuleId': granuleId };
    const cmrLink = granule.cmrLink;
    const reprocessStatus = get(this.props.granules.reprocessed, [granuleId, 'status']);
    const removeStatus = get(this.props.granules.removed, [granuleId, 'status']);
    const deleteStatus = get(this.props.granules.deleted, [granuleId, 'status']);
    const errors = this.errors();
    const granuleError = granule.error;
    return (
      <div className='page__component'>
        <section className='page__section'>
          <h1 className='heading--large heading--shared-content'>{granuleId}</h1>

          <AsyncCommand action={this.delete}
            success={this.navigateBack}
            status={deleteStatus}
            disabled={granule.published}
            className={'form-group__element--right'}
            text={deleteStatus === 'success' ? 'Success!' : 'Delete'} />

          <AsyncCommand action={this.remove}
            success={this.fastReload}
            status={removeStatus}
            className={'form-group__element--right'}
            text={'Remove from CMR'} />

          <AsyncCommand action={this.reprocess}
            success={this.fastReload}
            status={reprocessStatus}
            className={'form-group__element--right'}
            text={'Reprocess'} />

          {lastUpdated(granule.queriedAt)}
          {this.renderStatus(granule.status)}
          {granuleError ? <ErrorReport report={granuleError} /> : null}
        </section>

        <section className='page__section'>
          {errors ? <ErrorReport report={errors} /> : null}
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium'>Granule Overview {cmrLink ? <a href={cmrLink}>[CMR]</a> : null}</h2>
          </div>
          <dl className='metadata__granule__details'>
            {metaAccessors.reduce((acc, meta, i) => {
              let value = get(granule, meta[1]);
              if (value !== nullValue && typeof meta[2] === 'function') {
                value = meta[2](value);
              }
              return acc.concat([
                <dt key={`meta-${meta[1]}--dt`}>{meta[0]}</dt>,
                <dd key={`meta-${meta[1]}--dd`}>{value}</dd>
              ]);
            }, [])}
          </dl>
        </section>

        <section className='page__section'>
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium heading--shared-content'>Files</h2>
          </div>
          <SortableTable data={files} header={tableHeader} row={tableRow}/>
        </section>

        <section className='page__section'>
          <LogViewer query={logsQuery} dispatch={this.props.dispatch} logs={this.props.logs}/>
        </section>
      </div>
    );
  }
});

export default connect(state => state)(GranuleOverview);
