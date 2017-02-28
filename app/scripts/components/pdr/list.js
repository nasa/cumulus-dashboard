'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { get } from 'object-path';
import { Link } from 'react-router';
import { listPdrs } from '../../actions';
import SortableTable from '../table/sortable';
import { fullDate } from '../../utils/format';
import Pagination from '../app/pagination';
import Loading from '../app/loading-indicator';

const tableHeader = [
  'Name',
  'Status',
  'Granules',
  'Ingesting',
  'Processing',
  'Archiving',
  'Updating CMR',
  'Completed'
];

const tableRow = [
  (d) => <Link to={`granules/pdr/${d.pdrName}`}>{d.pdrName}</Link>,
  'status',
  (d) => get(d, ['granulesStatus', 'total'], 0),
  (d) => get(d, ['granulesStatus', 'ingesting'], 0),
  (d) => get(d, ['granulesStatus', 'processing'], 0),
  (d) => get(d, ['granulesStatus', 'archiving'], 0),
  (d) => get(d, ['granulesStatus', 'cmr'], 0),
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
    pdrs: React.PropTypes.object
  },

  componentWillMount: function () {
    this.list(this.state.page);
  },

  componentWillReceiveProps: function (newProps) {
    if (typeof newProps.pdrs.meta.page !== 'undefined') {
      this.setState({ page: newProps.pdrs.meta.page });
    }
  },

  list: function (page) {
    this.props.dispatch(listPdrs({ page }));
  },

  queryNewPage: function (page) {
    this.list(page);
  },

  render: function () {
    const { list, meta } = this.props.pdrs;
    const { count, limit } = meta;
    const { page } = this.state;
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
        {list.length ? null : <Loading />}
        <section className='page__section'>
          <Pagination count={count} limit={limit} page={page} onNewPage={this.queryNewPage} />
        </section>
        <SortableTable data={list} header={tableHeader} row={tableRow}/>
      </div>
    );
  }
});

export default connect(state => state)(PdrsOverview);
