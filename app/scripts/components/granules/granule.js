'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { getGranule } from '../../actions';
import { get } from 'object-path';
import { fullDate } from '../../utils/format';
import SortableTable from '../table/sortable';

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
    const collectionName = this.props.params.collectionName;
    const granuleId = this.props.params.granuleId;

    // check for granule in map first, otherwise request it
    const mapId = `${this.props.params.collectionName}-${granuleId}`;
    if (!get(this.props.granules.map, mapId)) {
      this.props.dispatch(getGranule(collectionName, granuleId));
    }
  },

  render: function () {
    const granuleId = this.props.params.granuleId;

    const mapId = `${this.props.params.collectionName}-${granuleId}`;
    const record = get(this.props.granules, ['map', mapId]);
    console.log(record);

    if (!record) {
      return <div></div>;
    } else if (record.inflight) {
      // TODO loading indicator
      return <div></div>;
    }

    const granule = record.data;

    const files = [];
    Object.keys(granule.files).forEach(function (key) {
      files.push(granule.files[key]);
    });

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
          <div className='page__section--subsection page__section__granule--progress'>
            <div className='progress-bar'>
              <span></span>
            </div>
            <ol>
              <li>Ingest</li>
              <li>Processing</li>
              <li>Pushed to CMR</li>
              <li>Archive</li>
            </ol>
          </div>
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
