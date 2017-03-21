'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { interval, getGranule, reprocessGranule } from '../../actions';
import { get } from 'object-path';
import { fullDate, lastUpdated, seconds, nullValue } from '../../utils/format';
import SortableTable from '../table/sortable';
import Loading from '../app/loading-indicator';
import LogViewer from '../logs/viewer';
import AsyncCommand from '../form/async-command';
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
    logs: React.PropTypes.object
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

  reprocess: function () {
    const { granuleId } = this.props.params;
    this.props.dispatch(reprocessGranule(granuleId));
  },

  renderStatus: function (status) {
    const statusList = [
      ['Ingest', 'ingesting'],
      ['Processing', 'processing'],
      ['Pushed to CMR', 'cmr'],
      ['Archiving', 'archiving'],
      ['Complete', 'completed']
    ];
    const indicatorClass = 'progress-bar__indicator progress-bar__indicator--' + status;
    return (
      <div className='page__section--subsection page__section__granule--progress'>
        <div className='progress-bar'>

          <div className={indicatorClass}>
            <div className='pulse'>
              <div className='pulse__dot'></div>
              <div className='pulse__ring'></div>
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
    const logsQuery = { granuleId };
    const cmrLink = granule.cmrLink;
    const reprocessStatus = get(this.props.granules.reprocessed, [granuleId, 'status']);
    return (
      <div className='page__component'>
        <section className='page__section'>
          <h1 className='heading--large heading--shared-content'>{granuleId}</h1>
          <Link className='button button--small form-group__element--right button--disabled button--green' to='/'>Delete</Link>
          <Link className='button button--small form-group__element--right button--green' to='/'>Remove from CMR</Link>

          <AsyncCommand action={this.reprocess}
            success={this.fastReload}
            status={reprocessStatus}
            text={'Reprocess'} />

          {lastUpdated(granule.queriedAt)}
          {this.renderStatus(granule.status)}
        </section>

        <section className='page__section'>
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
