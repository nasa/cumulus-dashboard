'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { get } from 'object-path';
import { Link } from 'react-router';
import { interval, listPdrs } from '../../actions';
import SortableTable from '../table/sortable';
import Pagination from '../app/pagination';
import Loading from '../app/loading-indicator';
import LogViewer from '../logs/viewer';
import { updateInterval } from '../../config';

const tableHeader = [
  'Name',
  'Status',
  'Granules',
  'Ingesting',
  'Processing',
  'Updating CMR',
  'Archiving',
  'Completed'
];

const tableRow = [
  (d) => <Link to={`granules/pdr/${d.pdrName}`}>{d.pdrName}</Link>,
  'status',
  (d) => get(d, ['granulesStatus', 'total'], 0),
  (d) => get(d, ['granulesStatus', 'ingesting'], 0),
  (d) => get(d, ['granulesStatus', 'processing'], 0),
  (d) => get(d, ['granulesStatus', 'cmr'], 0),
  (d) => get(d, ['granulesStatus', 'archiving'], 0),
  (d) => get(d, ['granulesStatus', 'completed'], 0)
];

var PdrsOverview = React.createClass({
  displayName: 'PdrsOverview',

  getInitialState: function () {
    return {
      page: 1
    };
  },

  propTypes: {
    dispatch: React.PropTypes.func,
    pdrs: React.PropTypes.object,
    logs: React.PropTypes.object
  },

  componentWillMount: function () {
    this.list(this.state.page);
  },

  componentWillReceiveProps: function (newProps) {
    const newPage = newProps.pdrs.list.meta.page;
    if (newPage) {
      this.setState({ page: newPage });
    }
  },

  componentWillUnmount: function () {
    if (this.cancelInterval) { this.cancelInterval(); }
  },

  list: function (page) {
    if (this.cancelInterval) { this.cancelInterval(); }
    const { dispatch } = this.props;
    this.cancelInterval = interval(() => dispatch(listPdrs({ page })), updateInterval, true);
  },

  queryNewPage: function (page) {
    this.list(page);
  },

  render: function () {
    const { list } = this.props.pdrs;
    const { count, limit } = list.meta;
    const { page } = this.state;
    const logsQuery = { q: 'pdrName' };
    return (
      <div className='page__component'>
        <section className='page__section'>
          <h1 className='heading--large heading--shared-content'>PDR's Overview { count ? `(${count})` : null }</h1>
          <dl className='metadata__updated'>
            <dt>Last Updated:</dt>
            <dd>Sept. 23, 2016</dd>
            <dd className='metadata__updated__time'>2:00pm EST</dd>
          </dl>
          <hr />
        </section>
        {list.inflight ? <Loading /> : null}
        <section className='page__section'>
          <Pagination count={count} limit={limit} page={page} onNewPage={this.queryNewPage} />
        </section>
        <SortableTable data={list.data} header={tableHeader} row={tableRow}/>
        <LogViewer query={logsQuery} dispatch={this.props.dispatch} logs={this.props.logs}/>
      </div>
    );
  }
});

export default connect(state => state)(PdrsOverview);
