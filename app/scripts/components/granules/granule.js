'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { interval, getGranule, reprocessGranule } from '../../actions';
import { get } from 'object-path';
import { fullDate, lastUpdated, nullValue } from '../../utils/format';
import SortableTable from '../table/sortable';
import Loading from '../app/loading-indicator';
import Ellipsis from '../app/loading-ellipsis';
import { updateInterval } from '../../config';
import LogViewer from '../logs/viewer';

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

var GranuleOverview = React.createClass({
  displayName: 'Granule',

  getInitialState: function () {
    return {
      reprocessing: false
    };
  },

  propTypes: {
    params: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    granules: React.PropTypes.object,
    logs: React.PropTypes.object
  },

  componentWillMount: function () {
    const { granuleId } = this.props.params;
    const immediate = !get(this.props.granules.map, granuleId);
    this.reload(immediate);
  },

  componentWillUnmount: function () {
    if (this.cancelInterval) { this.cancelInterval(); }
  },

  reload: function (immediate) {
    const granuleId = this.props.params.granuleId;
    const { dispatch } = this.props;
    if (this.cancelInterval) { this.cancelInterval(); }
    this.cancelInterval = interval(() => dispatch(getGranule(granuleId)), updateInterval, immediate);
    this.cancelInterval();
  },

  reprocess: function () {
    const { granuleId } = this.props.params;
    const { reprocessing } = this.state;
    if (!reprocessing) {
      this.props.dispatch(reprocessGranule(granuleId));
      this.setState({ reprocessing: true });
      setTimeout(function () {
        this.reload(true);
        this.setState({ reprocessing: false });
      }.bind(this), 2000);
    }
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
    const record = get(this.props.granules.map, granuleId);

    if (!record) {
      return <div></div>;
    } else if (record.inflight && !record.data) {
      return <Loading />;
    }

    const granule = record.data;
    const { reprocessing } = this.state;

    const files = [];
    if (granule.files) {
      for (let key in granule.files) { files.push(granule.files[key]); }
    }
    const logsQuery = { granuleId };
    return (
      <div className='page__component'>
        <section className='page__section'>
          <h1 className='heading--large heading--shared-content'>{granuleId}</h1>
          <Link className='button button--small form-group__element--right button--disabled button--green' to='/'>Delete</Link>
          <Link className='button button--small form-group__element--right button--green' to='/'>Remove from CMR</Link>
          <button
            className={'button button--small form-group__element--right button--green' + (reprocessing ? ' button--reprocessing' : '')}
            onClick={this.reprocess}>Reprocess{ reprocessing ? <Ellipsis /> : '' }</button>
          {lastUpdated(granule.queriedAt)}
          {this.renderStatus(granule.status)}
        </section>

        <section className='page__section'>
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium'>Granule Overview</h2>
          </div>
          <dl className='metadata__granule__details'>
            <dt>Created</dt>
            <dd>{fullDate(granule.createdAt)}</dd>
            <dt>Ingested</dt>
            <dd>{fullDate(granule.ingestEnded)}</dd>
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
