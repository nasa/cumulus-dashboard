'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import {
  getCollection,
  listGranules,
  deleteCollection
} from '../../actions';
import { get } from 'object-path';
import {
  seconds,
  tally,
  lastUpdated,
  getCollectionId,
  deleteText
} from '../../utils/format';
import ErrorReport from '../errors/report';
import List from '../table/list-view';
import Overview from '../app/overview';
import AsyncCommand from '../form/async-command';
import { tableHeader, tableRow, tableSortProps } from '../../utils/table-config/granules';
import { updateDelay } from '../../config';

const granuleFields = 'status,granuleId,pdrName,duration,updatedAt';

const CollectionOverview = React.createClass({
  displayName: 'CollectionOverview',

  propTypes: {
    params: PropTypes.object,
    dispatch: PropTypes.func,
    granules: PropTypes.object,
    collections: PropTypes.object,
    router: PropTypes.object
  },

  componentWillMount: function () {
    this.load();
  },

  componentWillReceiveProps: function ({ params }) {
    const { collectionName, collectionVersion } = params;
    if (collectionName !== this.props.params.collectionName ||
       collectionVersion !== this.props.params.collectionVersion) {
      this.load();
    }
  },

  load: function () {
    const { collectionName, collectionVersion } = this.props.params;
    this.props.dispatch(getCollection(collectionName, collectionVersion));
  },

  generateQuery: function () {
    const { collectionName, collectionVersion } = this.props.params;
    return {
      collectionId: `${collectionName}___${collectionVersion}`,
      fields: granuleFields,
      status__not: 'completed,failed'
    };
  },

  delete: function () {
    const { collectionName, collectionVersion } = this.props.params;
    this.props.dispatch(deleteCollection(collectionName, collectionVersion));
  },

  navigateBack: function () {
    const { router } = this.props;
    router.push('/collections/all');
  },

  errors: function () {
    const { collectionName, collectionVersion } = this.props.params;
    const collectionId = getCollectionId({name: collectionName, version: collectionVersion});
    return [
      get(this.props.collections.map, [collectionId, 'error']),
      get(this.props.collections.deleted, [collectionId, 'error'])
    ].filter(Boolean);
  },

  renderOverview: function (record) {
    const data = get(record, 'data', {});
    const stats = get(data, 'stats', {});
    const overview = [
      [tally(stats.running), 'Granules Running'],
      [tally(stats.completed), 'Granules Completed'],
      [tally(stats.failed), 'Granules Failed'],
      [seconds(data.duration), 'Average Processing Time']
    ];
    return <Overview items={overview} inflight={record.inflight} />;
  },

  render: function () {
    const { collectionName, collectionVersion } = this.props.params;
    const { granules, collections } = this.props;
    const collectionId = getCollectionId({name: collectionName, version: collectionVersion});
    const record = collections.map[collectionId];
    const { list } = granules;
    const { meta } = list;
    const deleteStatus = get(collections.deleted, [collectionId, 'status']);
    const errors = this.errors();

    // create the overview boxes
    const overview = record ? this.renderOverview(record) : <div></div>;
    return (
      <div className='page__component'>
        <section className='page__section page__section__header-wrapper'>
          <h1 className='heading--large heading--shared-content with-description'>{collectionName} / {collectionVersion}</h1>
          <div className='form-group__element--right'>
          <AsyncCommand action={this.delete}
            success={this.navigateBack}
            successTimeout={updateDelay}
            status={deleteStatus}
            confirmAction={true}
            confirmText={deleteText(`${collectionName} ${collectionVersion}`)}
            text={deleteStatus === 'success' ? 'Success!' : 'Delete' } />
          </div>

          <Link className='button button--small form-group__element--right button--green' to={`/collections/edit/${collectionName}/${collectionVersion}`}>Edit</Link>
          {lastUpdated(get(record, 'data.timestamp'))}
          {overview}
          {errors.length ? errors.map((error, i) => <ErrorReport key={i} report={error} />) : null}
        </section>
        <section className='page__section'>
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium heading--shared-content with-description'>Processing Granules <span className='num--title'>{meta.count ? ` (${meta.count})` : null}</span></h2>
          </div>
          <List
            list={list}
            dispatch={this.props.dispatch}
            action={listGranules}
            tableHeader={tableHeader}
            tableRow={tableRow}
            tableSortProps={tableSortProps}
            query={this.generateQuery()}
            rowId={'granuleId'}
            sortIdx={6}
          />
          <Link className='link--secondary link--learn-more' to={`/collections/collection/${collectionName}/${collectionVersion}/granules`}>View All Granules</Link>
        </section>
      </div>
    );
  }
});

export default connect(state => state)(CollectionOverview);
