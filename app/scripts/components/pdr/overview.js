'use strict';
import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { get } from 'object-path';
import { listPdrs, getCount, deletePdr } from '../../actions';
import { bool, lastUpdated, tally, displayCase, fromNow } from '../../utils/format';
import List from '../table/list-view';
import Overview from '../app/overview';
import { recent } from '../../config';
import statusOptions from '../../utils/status';
const stats = Object.keys(statusOptions).map(d => statusOptions[d]).filter(Boolean);

function bar (pct, text) {
  // show a sliver even if there's no progress
  const width = pct || 0.5;
  return (
    <div className='table__progress--outer'>
      <div className='table__progress--bar' style={{width: width + '%'}} />
      <div className='table__progress--text' style={{left: width + '%'}}>{text}</div>
    </div>
  );
}

function renderProgress (d) {
  const granules = d.granulesStatus;
  const total = stats.reduce((a, b) => a + get(granules, b, 0), 0);
  const completed = get(granules, 'completed', 0);
  const percentCompleted = !total ? 0 : completed / total * 100;
  const granulesCompleted = `${tally(completed)}/${tally(total)}`;
  return (
    <div className='table__progress'>
      {bar(percentCompleted, granulesCompleted)}
    </div>
  );
}

const tableHeader = [
  'Name',
  'Status',
  'Progress',
  'Errors',
  'PAN/PDRD Sent',
  'Discovered'
];

const tableRow = [
  (d) => <Link to={`pdrs/pdr/${d.pdrName}`}>{d.pdrName}</Link>,
  'status',
  renderProgress,
  (d) => tally(get(d, 'granulesStatus.failed', 0)),
  (d) => bool(d.PANSent || d.PDRDSent),
  (d) => fromNow(d.discoveredAt)
];

export const tableSortProps = [
  'pdrName.keyword',
  'status.keyword',
  null,
  null,
  null,
  'discoveredAt'
];

var PdrOverview = React.createClass({
  displayName: 'PdrOverview',

  getInitialState: function () {
    return {
      page: 1,
      sortIdx: 0,
      order: 'desc',
      selected: [],
      prefix: null,
      queryConfig: {},
      params: {}
    };
  },

  propTypes: {
    dispatch: React.PropTypes.func,
    pdrs: React.PropTypes.object,
    stats: React.PropTypes.object
  },

  componentWillMount: function () {
    this.queryStats();
  },

  queryStats: function () {
    this.props.dispatch(getCount({
      type: 'pdrs',
      field: 'status'
    }));
  },

  renderOverview: function (count) {
    const overview = count.map(d => [tally(d.count), displayCase(d.key)]);
    return <Overview items={overview} inflight={false} />;
  },

  generateQuery: function () {
    return {
      limit: 10,
      updatedAt__from: recent
    };
  },

  generateBulkActions: function () {
    return [{
      text: 'Delete',
      action: deletePdr,
      state: this.props.pdrs.deleted
    }];
  },

  render: function () {
    const { stats } = this.props;
    const { list } = this.props.pdrs;
    const { count, queriedAt } = list.meta;
    // create the overview boxes
    const pdrCount = get(stats.count, 'data.pdrs.count', []);
    const overview = this.renderOverview(pdrCount);
    return (
      <div className='page__component'>
        <section className='page__section'>
          <h1 className='heading--large heading--shared-content with-description'>PDRs Overview</h1>
          {lastUpdated(queriedAt)}
          {overview}
        </section>
        <section className='page__section'>
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium heading--shared-content with-description'>Recently Active PDRs{count ? ` (${count})` : null}</h2>
          </div>

          <List
            list={list}
            dispatch={this.props.dispatch}
            action={listPdrs}
            tableHeader={tableHeader}
            tableRow={tableRow}
            tableSortProps={tableSortProps}
            query={this.generateQuery()}
            bulkActions={this.generateBulkActions()}
            rowId={'pdrName'}
          />
          <Link className='link--secondary link--learn-more' to='/pdrs/active'>View Currently Active PDRs</Link>
        </section>
      </div>
    );
  }
});

export default connect(state => state)(PdrOverview);
