'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { get } from 'object-path';
import { Link } from 'react-router';
import { interval, listPdrs, searchPdrs, clearPdrSearch } from '../../actions';
import { tally, seconds, pdrSearchResult } from '../../utils/format';
import SortableTable from '../table/sortable';
import Pagination from '../app/pagination';
import ErrorReport from '../errors/report';
import Loading from '../app/loading-indicator';
import LogViewer from '../logs/viewer';
import Search from '../form/search';
import { updateInterval } from '../../config';
import { isUndefined } from '../../utils/validate';

const tableHeader = [
  'Name',
  'Status',
  'Duration',
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
  (d) => seconds(d.averageDuration),
  (d) => tally(get(d, 'granules', 0)),
  (d) => tally(get(d, ['granulesStatus', 'ingesting'], 0)),
  (d) => tally(get(d, ['granulesStatus', 'processing'], 0)),
  (d) => tally(get(d, ['granulesStatus', 'cmr'], 0)),
  (d) => tally(get(d, ['granulesStatus', 'archiving'], 0)),
  (d) => tally(get(d, ['granulesStatus', 'completed'], 0))
];

const tableSortProps = [
  'pdrName.keyword',
  'status.keyword',
  null,
  null,
  null,
  null,
  null,
  null,
  null
];

var PdrsOverview = React.createClass({
  displayName: 'PdrsOverview',

  getInitialState: function () {
    return {
      page: 1,
      sortIdx: 1,
      order: 'desc',
      error: null
    };
  },

  propTypes: {
    dispatch: React.PropTypes.func,
    pdrs: React.PropTypes.object,
    logs: React.PropTypes.object
  },

  componentWillMount: function () {
    this.list();
  },

  componentWillReceiveProps: function (newProps) {
    const newPage = newProps.pdrs.list.meta.page;
    if (newPage) {
      this.setState({ page: newPage });
    }

    const error = newProps.pdrs.list.error;
    if (error) {
      this.setState({ error });
      if (this.cancelInterval) { this.cancelInterval(); }
    }
  },

  componentWillUnmount: function () {
    if (this.cancelInterval) { this.cancelInterval(); }
  },

  list: function (options) {
    options = options || {};
    // attach page, pdrName, and sort properties using the current state
    if (isUndefined(options.page)) { options.page = this.state.page; }
    if (isUndefined(options.order)) { options.order = this.state.order; }
    if (isUndefined(options.sort_by)) { options.sort_by = tableSortProps[this.state.sortIdx]; }

    // remove empty keys so as not to mess up the query
    for (let key in options) { !options[key] && delete options[key]; }

    if (this.cancelInterval) { this.cancelInterval(); }
    const { dispatch } = this.props;
    this.cancelInterval = interval(() => dispatch(listPdrs(options)), updateInterval, true);
  },

  queryNewPage: function (page) {
    this.list({page});
  },

  setSort: function (sortProps) {
    this.setState(sortProps);
    this.list({
      order: sortProps.order,
      sort_by: tableSortProps[sortProps.sortIdx]
    });
  },

  render: function () {
    const { list, search } = this.props.pdrs;
    const { count, limit } = list.meta;
    const { error, page, sortIdx, order } = this.state;
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
          <div className='filters'>
            <Search dispatch={this.props.dispatch}
              action={searchPdrs}
              results={search}
              format={pdrSearchResult}
              clear={clearPdrSearch}
            />
          </div>
        </section>
        {list.inflight ? <Loading /> : null}

        {error ? <ErrorReport report={error} /> : null}

        <SortableTable
          data={list.data}
          header={tableHeader}
          row={tableRow}
          props={tableSortProps}
          sortIdx={sortIdx}
          order={order}
          changeSortProps={this.setSort} />
        <section className='page__section'>
          <Pagination count={count} limit={limit} page={page} onNewPage={this.queryNewPage} />
        </section>
        <LogViewer query={logsQuery} dispatch={this.props.dispatch} logs={this.props.logs}/>
      </div>
    );
  }
});

export default connect(state => state)(PdrsOverview);
