'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { interval, getGranule } from '../../actions';
import { get } from 'object-path';
import { fullDate } from '../../utils/format';
import SortableTable from '../table/sortable';
import Loading from '../app/loading-indicator';
import { updateInterval } from '../../config';

const tableHeader = [
  'Filename',
  'Original',
  'Staging',
  'Archive',
  'Access'
];

const tableRow = [
  (d) => d.name,
  (d) => (<a href={d.sipFile}>Link</a>),
  (d) => (<a href={d.stagingFile}>Link</a>),
  (d) => (<a href={d.archivedFile}>Link</a>),
  (d) => d.access
];

var GranuleOverview = React.createClass({
  displayName: 'Granule',

  propTypes: {
    params: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    granules: React.PropTypes.object
  },

  componentWillMount: function () {
    const granuleId = this.props.params.granuleId;
    const immediate = !get(this.props.granules.map, granuleId);
    const { dispatch } = this.props;
    this.cancelInterval = interval(() => dispatch(getGranule(granuleId)), updateInterval, immediate);
  },

  componentWillUnmount: function () {
    if (this.cancelInterval) { this.cancelInterval(); }
  },

  renderStatus: function (status) {
    const statusList = [
      ['Ingest', 'ingesting'],
      ['Processing', 'processing'],
      ['Pushed to CMR', 'cmr'],
      ['Archive', 'archiving'],
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
    const record = get(this.props.granules, ['map', granuleId]);

    if (!record) {
      return <div></div>;
    } else if (record.inflight && !record.data) {
      return <Loading />;
    }

    const granule = record.data;
    const files = [];
    for (let key in granule.files) { files.push(granule.files[key]); }

    return (
      <div className='page__component'>
        <section className='page__section'>
          <h1 className='heading--large heading--shared-content'>{granuleId}</h1>
          <Link className='button button--small form-group__element--right button--disabled button--green' to='/'>Delete</Link>
          <Link className='button button--small form-group__element--right button--green' to='/'>Remove from CMR</Link>
          <Link className='button button--small form-group__element--right button--green' to='/'>Reprocess</Link>
          <dl className="metadata__updated">
            <dt>Last Updated:</dt>
            <dd>Sept. 23, 2016</dd>
            <dd className='metadata__updated__time'>2:00pm EST</dd>
          </dl>
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
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium heading--shared-content'>Logs</h2>
            <form className="search__wrapper form-group__element form-group__element--right form-group__element--right--sm form-group__element--small" onSubmit="">
              <input className='search' type="search" />
              <span className="search__icon"></span>
            </form>
          </div>
          <div className="logs">
            <p>This is where the logs would go</p>
          </div>
        </section>
      </div>
    );
  }
});

export default connect(state => state)(GranuleOverview);
