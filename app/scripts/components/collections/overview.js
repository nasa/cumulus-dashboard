'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {
  getCollection,
  listGranules,
  deleteCollection,
  reprocessGranule,
  removeGranule,
  deleteGranule
} from '../../actions';
import { get } from 'object-path';
import { seconds, tally, lastUpdated } from '../../utils/format';
import ErrorReport from '../errors/report';
import List from '../table/list-view';
import Overview from '../app/overview';
import AsyncCommand from '../form/async-command';
import { tableHeader, tableRow, tableSortProps } from '../../utils/table-config/granules';

const granuleFields = 'status,granuleId,pdrName,duration,updatedAt';

var CollectionOverview = React.createClass({
  displayName: 'CollectionOverview',

  propTypes: {
    params: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    granules: React.PropTypes.object,
    collections: React.PropTypes.object,
    router: React.PropTypes.object
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
  },

  generateQuery: function () {
    const collectionName = this.props.params.collectionName;
    return {
      collectionName,
      fields: granuleFields,
      status__not: 'completed'
    };
  },

  generateBulkActions: function () {
    const { granules } = this.props;
    return [{
      text: 'Reprocess',
      action: reprocessGranule,
      state: granules.reprocessed
    }, {
      text: 'Remove from CMR',
      action: removeGranule,
      state: granules.removed
    }, {
      text: 'Delete',
      action: deleteGranule,
      state: granules.deleted
    }];
  },

  delete: function () {
    const collectionName = this.props.params.collectionName;
    this.props.dispatch(deleteCollection(collectionName));
  },

  navigateBack: function () {
    // delay the navigation so we can see the success indicator
    const { router } = this.props;
    setTimeout(() => router.push('/collections/active'), 1000);
  },

  errors: function () {
    const collectionName = this.props.params.collectionName; const errors = [ get(this.props.collections.map, [collectionName, 'error']),
      get(this.props.collections.deleted, [collectionName, 'error'])
    ].filter(Boolean);
    return errors.length ? errors.map(JSON.stringify).join(', ') : null;
  },

  renderOverview: function (record) {
    const data = get(record, 'data', {});
    const granules = get(data, 'granulesStatus', {});
    const overview = [
      [seconds(data.averageDuration), 'Average Processing Time'],
      [tally(data.granules), 'Total Granules'],
      [tally(granules.ingesting), 'Granules Ingesting'],
      [tally(granules.processing), 'Granules Processing'],
      [tally(granules.cmr), 'Granules Pushed to CMR'],
      [tally(granules.archiving), 'Granules Archiving']
    ];
    return <Overview items={overview} inflight={record.inflight} />;
  },

  render: function () {
    const collectionName = this.props.params.collectionName;
    const { granules, collections } = this.props;
    const record = collections.map[collectionName];
    const { list } = granules;
    const { meta } = list;
    const deleteStatus = get(collections.deleted, [collectionName, 'status']);
    const hasGranules = get(record.data, 'granules');
    const errors = this.errors();

    // create the overview boxes
    const overview = record ? this.renderOverview(record) : <div></div>;
    return (
      <div className='page__component'>
        <section className='page__section'>
          <h1 className='heading--large heading--shared-content'>{collectionName}</h1>

          <AsyncCommand action={this.delete}
            success={this.navigateBack}
            status={deleteStatus}
            disabled={hasGranules !== 0}
            className={'form-group__element--right'}
            text={deleteStatus === 'success' ? 'Success!' : 'Delete' } />

          <Link className='button button--small form-group__element--right button--green' to={`/collections/edit/${collectionName}`}>Edit</Link>
          {lastUpdated(meta.queriedAt)}
          {overview}
          { errors ? <ErrorReport report={errors} /> : null }
        </section>
        <section className='page__section'>
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium heading--shared-content'>Processing Granules{meta.count ? ` (${meta.count})` : null}</h2>
          </div>
          <List
            list={list}
            dispatch={this.props.dispatch}
            action={listGranules}
            tableHeader={tableHeader}
            tableRow={tableRow}
            tableSortProps={tableSortProps}
            query={this.generateQuery()}
            bulkActions={this.generateBulkActions()}
            rowId={'granuleId'}
          />
          <Link className='link--secondary link--learn-more' to={`/collections/collection/${collectionName}/granules`}>View All Granules</Link>
        </section>
      </div>
    );
  }
});

export default connect(state => state)(CollectionOverview);
