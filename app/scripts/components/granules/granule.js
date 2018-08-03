'use strict';
import path from 'path';
import React from 'react';
import PropTypes from 'prop-types';
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
  collectionLink,
  providerLink,
  pdrLink,
  deleteText
} from '../../utils/format';
import SortableTable from '../table/sortable';
import Loading from '../app/loading-indicator';
import LogViewer from '../logs/viewer';
import ErrorReport from '../errors/report';
import Metadata from '../table/metadata';
import AsyncCommands from '../form/dropdown-async-command';
import { updateInterval } from '../../config';
import { strings } from '../locale';

const tableHeader = [
  'Filename',
  'Link',
  'Bucket'
];

const link = 'Link';

const makeLink = (s3Uri) => {
  const chunks = s3Uri.split('/');
  const bucket = chunks[2];
  const key = chunks.slice(3).join('/');
  return `https://${bucket}.s3.amazonaws.com/${key}`;
};

const tableRow = [
  (d) => d.name || '(No name)',
  (d) => d.filename ? (<a href={makeLink(d.filename)}>{d.filename ? link : nullValue}</a>) : null,
  (d) => d.bucket
];

const metaAccessors = [
  ['PDR Name', 'pdrName', pdrLink],
  ['Collection', 'collectionId', collectionLink],
  ['Provider', 'provider', providerLink],
  ['CMR/OnEarth Link', 'cmrLink', (d) => d ? <a href={d} target='_blank'>Link</a> : nullValue],
  ['Execution', 'execution', (d) => d ? <Link to={`/executions/execution/${path.basename(d)}`}>link</Link> : nullValue],
  ['Published', 'published', bool],
  ['Duplicate', 'hasDuplicate', bool],
  ['Total duration', 'duration', seconds]
];

var GranuleOverview = React.createClass({
  displayName: strings.granule,

  propTypes: {
    params: PropTypes.object,
    dispatch: PropTypes.func,
    granules: PropTypes.object,
    logs: PropTypes.object,
    router: PropTypes.object,
    skipReloadOnMount: PropTypes.bool
  },

  getDefaultProps: function () {
    return {
      skipReloadOnMount: false
    };
  },

  componentWillMount: function () {
    const { granuleId } = this.props.params;

    if (this.props.skipReloadOnMount) return;

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
      success: this.fastReload
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
          <SortableTable
            data={files}
            header={tableHeader}
            row={tableRow}
            props={['name', 'filename', 'bucket']}
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
});
export { GranuleOverview };

export default connect(state => ({
  granules: state.granules,
  logs: state.logs
}))(GranuleOverview);
