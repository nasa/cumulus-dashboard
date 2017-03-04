'use strict';
import React from 'react';
import { interval } from '../../actions';
import SortableTable from './sortable';
import Pagination from '../app/pagination';
import Loading from '../app/loading-indicator';
import ErrorReport from '../errors/report';
import { updateInterval } from '../../config';
import { isUndefined as undef } from '../../utils/validate';

var List = React.createClass({
  displayName: 'List',

  getInitialState: function () {
    return {
      page: 1,
      sortIdx: 0,
      order: 'desc'
    };
  },

  propTypes: {
    list: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    action: React.PropTypes.func,
    tableHeader: React.PropTypes.array,
    tableRow: React.PropTypes.array,
    tableSortProps: React.PropTypes.array,
    query: React.PropTypes.object,
    isRemovable: React.PropTypes.bool
  },

  componentWillMount: function () {
    this.list();
  },

  componentWillUnmount: function () {
    if (this.cancelInterval) { this.cancelInterval(); }
  },

  componentWillReceiveProps: function (newProps) {
    if (JSON.stringify(newProps.query) !== JSON.stringify(this.props.query)) {
      this.list({}, newProps.query);
    }
  },

  queryNewPage: function (page) {
    this.setState({ page });
    this.list({ page });
  },

  queryNewSort: function (sortProps) {
    this.setState(sortProps);
    this.list({ order: sortProps.order, sort_by: this.getSortProp(sortProps.sortIdx) });
  },

  getSortProp: function (idx) {
    return this.props.tableSortProps[idx];
  },

  list: function (options, query) {
    options = options || {};
    const { page, order, sort_by } = options;

    // attach page, and sort properties using the current state
    if (undef(page)) { options.page = this.state.page; }
    if (undef(order)) { options.order = this.state.order; }
    if (undef(sort_by)) { options.sort_by = this.getSortProp(this.state.sortIdx); }

    if (query) {
      options = Object.assign({}, options, query);
    } else if (this.props.query) {
      options = Object.assign({}, options, this.props.query);
    }

    // remove empty keys so as not to mess up the query
    for (let key in options) { !options[key] && delete options[key]; }

    // stop the currently running auto-query
    if (this.cancelInterval) { this.cancelInterval(); }
    const { dispatch, action } = this.props;
    this.cancelInterval = interval(() => dispatch(action(options)), updateInterval, true);
  },

  render: function () {
    const { tableHeader, tableRow, tableSortProps, isRemovable } = this.props;
    const { list } = this.props;
    const { count, limit } = list.meta;
    const { page, sortIdx, order } = this.state;
    return (
      <div>
        {isRemovable ? (
          <div className='form--controls'>
            <label className='form__element__select form-group__element form-group__element--small'><input type='checkbox' name='Select' value='Select' />Select</label>
            <button className='button button--small form-group__element'>Remove From CMR</button>
            <button className='button button--small form-group__element'>Reprocess</button>
          </div>
        ) : null}

        {list.inflight ? <Loading /> : null}
        {list.error ? <ErrorReport report={list.error} /> : null}

        <SortableTable
          data={list.data}
          header={tableHeader}
          row={tableRow}
          props={tableSortProps}
          sortIdx={sortIdx}
          order={order}
          changeSortProps={this.queryNewSort} />

        <Pagination count={count} limit={limit} page={page} onNewPage={this.queryNewPage} />
      </div>
    );
  }
});

export default List;
