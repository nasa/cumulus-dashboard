'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { getCollection, listGranules } from '../../actions';
import { get } from 'object-path';
import { seconds, tally, fullDate } from '../../utils/format';
import Loading from '../app/loading-indicator';
import ErrorReport from '../errors/report';
import SortableTable from '../table/sortable';

const tableHeader = [
  'Status',
  'Name',
  'PDR',
  'Duration',
  'Last Update'
];

const tableRow = [
  'status',
  (d) => <Link to={`/granules/granule/${d.granuleId}/overview`}>{d.granuleId}</Link>,
  'pdrName',
  (d) => seconds(d.duration),
  (d) => fullDate(d.updatedAt)
];

const activeStatus = 'ingesting OR processing OR cmr OR archiving';
const granuleFields = 'status,granuleId,pdrName,duration,updatedAt';

var CollectionOverview = React.createClass({
  displayName: 'CollectionOverview',

  propTypes: {
    params: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    granules: React.PropTypes.object,
    collections: React.PropTypes.object
  },

  componentWillMount: function () {
    this.load();
  },

  componentWillReceiveProps: function (newProps) {
    if (newProps.params.collectionName !== this.props.params.collectionName) {
      this.load();
    }
  },

  load: function () {
    const collectionName = this.props.params.collectionName;
    this.props.dispatch(getCollection(collectionName));
    this.props.dispatch(listGranules({
      collectionName,
      fields: granuleFields,
      q: activeStatus,
      limit: 10
    }));
  },

  renderOverview: function (record) {
    if (record.error) {
      return <ErrorReport report={record.error} />;
    }
    const data = get(record, 'data', {});
    const granules = get(data, 'granulesStatus', {});
    const overview = [
      [seconds(data.averageDuration), 'Average Processing Time'],
      [tally(granules.ingesting), 'Granules Ingesting'],
      [tally(granules.processing), 'Granules Processing'],
      [tally(granules.cmr), 'Granules Pushed to CMR'],
      [tally(granules.archiving), 'Granules Archiving']
    ];
    return (
      <div className='row'>
        {record.inflight ? <Loading /> : null}
        <ul>
          {overview.map(d => (
            <li key={d[1]}>
              <span className='overview-num' to='/'>
                <span className='num--large'>{d[0]}</span> {d[1]}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  },

  render: function () {
    const collectionName = this.props.params.collectionName;
    const { granules, collections } = this.props;
    const record = get(collections.map, collectionName);
    const { list } = granules;
    const { meta } = list;

    // create the overview boxes
    const overview = record ? this.renderOverview(record) : <div></div>;
    return (
      <div className='page__component'>
        <section className='page__section'>
          <h1 className='heading--large heading--shared-content'>{collectionName}</h1>
          <Link className='button button--small form-group__element--right button--disabled button--green' to={`/collections/edit/${collectionName}`}>Edit</Link>
          <dl className="metadata__updated">
            <dt>Last Updated:</dt>
            <dd>Sept. 23, 2016</dd>
            <dd className='metadata__updated__time'>2:00pm EST</dd>
          </dl>
          {overview}
        </section>
        <section className='page__section'>
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium heading--shared-content'>Processing Granules{meta.count ? ` (${meta.count})` : null}</h2>
          </div>
          <SortableTable data={list.data} header={tableHeader} row={tableRow}/>
          <Link className='link--secondary' to={`/collections/collection/${collectionName}/granules`}>View All Granules</Link>
        </section>
      </div>
    );
  }
});

export default connect(state => state)(CollectionOverview);
