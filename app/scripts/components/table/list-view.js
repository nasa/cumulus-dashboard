'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SortableTable from './sortable';
import Pagination from '../app/pagination';
import Loading from '../app/loading-indicator';
import ErrorReport from '../errors/report';
import BatchAsyncCommand from '../form/batch-async-command';
import Timer from '../app/timer';
import { isUndefined as undef } from '../../utils/validate';

var List = React.createClass({
  displayName: 'List',

  getInitialState: function () {
    return {
      page: 1,
      sortIdx: this.props.sortIdx || 0,
      order: 'desc',
      selected: [],
      prefix: null,
      queryConfig: {},
      params: {},
      completedBulkActions: 0,
      bulkActionError: null
    };
  },

  propTypes: {
    list: PropTypes.object,
    dispatch: PropTypes.func,
    action: PropTypes.func,
    tableHeader: PropTypes.array,
    tableRow: PropTypes.array,
    tableSortProps: PropTypes.array,
    sortIdx: PropTypes.number,
    query: PropTypes.object,
    bulkActions: PropTypes.array,
    rowId: PropTypes.any
  },

  componentWillMount: function () {
    this.setState({ queryConfig: this.config() });
  },

  componentWillReceiveProps: function (newProps) {
    if (JSON.stringify(newProps.query) !== JSON.stringify(this.props.query)) {
      this.setState({ queryConfig: this.config({}, newProps.query) });
    }

    // remove null and undefined values
    const { params } = newProps.list;
    const validParams = {};
    for (let key in params) {
      let value = params[key];
      if (!undef(value) && value !== null) {
        validParams[key] = value;
      }
    }

    if (JSON.stringify(validParams) !== JSON.stringify(this.state.params)) {
      this.setState({ params: validParams }, () => this.setState({
        queryConfig: this.config() }));
    }

    if (newProps.sortIdx !== this.state.sortIdx) {
      this.setState({ sortIdx: newProps.sortIdx });
    }
  },

  queryNewPage: function (page) {
    this.setState({ page });
    this.setState({
      queryConfig: this.config({ page }),
      selected: []
    });
  },

  queryNewSort: function (sortProps) {
    this.setState(sortProps);
    this.setState({
      queryConfig: this.config({
        order: sortProps.order,
        sort_by: this.getSortProp(sortProps.sortIdx)
      }),
      selected: []
    });
  },

  getSortProp: function (idx) {
    return this.props.tableSortProps[idx];
  },

  selectAll: function (e) {
    const { rowId, list } = this.props;
    const { data } = list;
    const allSelected = this.state.selected.length === data.length;
    if (!data.length) return;
    else if (allSelected) {
      this.setState({ selected: [] });
    } else {
      let selected;
      if (typeof rowId === 'function') {
        selected = data.map(rowId);
      } else {
        selected = data.map(d => d[this.props.rowId]);
      }
      this.setState({ selected });
    }
  },

  updateSelection: function (id) {
    const { selected } = this.state;
    if (selected.indexOf(id) === -1) {
      this.setState({ selected: selected.concat([id]) });
    } else {
      this.setState({ selected: selected.filter(d => d !== id) });
    }
  },

  onBulkActionSuccess: function () {
    // not-elegant way to trigger a re-fresh in the timer
    this.setState({
      completedBulkActions: this.state.completedBulkActions + 1,
      bulkActionError: null,
      selected: []
    });
  },

  onBulkActionError: function (error) {
    const message = `Could not process ${error.id}, ${error.error}`;
    this.setState({
      bulkActionError: message,
      selected: []
    });
  },

  config: function (config, query) {
    config = config || {};
    const { page, order, sort_by, params } = config;

    // attach page, params, and sort properties using the current state
    if (undef(page)) { config.page = this.state.page; }
    if (undef(order)) { config.order = this.state.order; }
    if (undef(sort_by)) { config.sort_by = this.getSortProp(this.state.sortIdx); }
    if (undef(params)) { Object.assign(config, this.state.params); }

    if (query) {
      config = Object.assign({}, config, query);
    } else if (this.props.query) {
      config = Object.assign({}, config, this.props.query);
    }

    // remove empty keys so as not to mess up the query
    for (let key in config) {
      if (config[key] === '') { delete config[key]; }
    }
    return config;
  },

  renderSelectAll: function () {
    const { list } = this.props;
    const allChecked = this.state.selected.length === list.data.length && list.data.length;
    return (
      <label className='form__element__select form-group__element form-group__element--small'>
        <input type='checkbox' className='form-select__all' name='Select' checked={allChecked} onChange={this.selectAll} />
        Select
      </label>
    );
  },

  render: function () {
    const {
      dispatch,
      action,
      tableHeader,
      tableRow,
      tableSortProps,
      bulkActions,
      rowId,
      list
    } = this.props;
    const { count, limit } = list.meta;
    const {
      page,
      sortIdx,
      order,
      selected,
      queryConfig,
      completedBulkActions,
      bulkActionError
    } = this.state;
    const primaryIdx = 0;
    const hasActions = Array.isArray(bulkActions) && bulkActions.length;

    return (
      <div className='list-view'>
        <Timer
          noheader={!hasActions}
          dispatch={dispatch}
          action={action}
          config={queryConfig}
          reload={completedBulkActions}
        />
        {hasActions ? (
          <div className='form--controls'>
            {this.renderSelectAll()}
            {bulkActions.map((item, i) => <BatchAsyncCommand key={item.text}
              dispatch={dispatch}
              action={item.action}
              state={item.state}
              text={item.text}
              confirm={item.confirm}
              onSuccess={this.onBulkActionSuccess}
              onError={this.onBulkActionError}
              selection={selected}
            />)}
          </div>
        ) : null}

        {list.inflight ? <Loading /> : null}
        {list.error ? <ErrorReport report={list.error} /> : null}
        {bulkActionError ? <ErrorReport report={bulkActionError} /> : null}

        <SortableTable
          primaryIdx={primaryIdx}
          data={list.data}
          header={tableHeader}
          row={tableRow}
          props={tableSortProps}
          sortIdx={sortIdx}
          order={order}
          changeSortProps={this.queryNewSort}
          onSelect={this.updateSelection}
          canSelect={!!hasActions}
          selectedRows={selected}
          rowId={rowId}
        />
        <Pagination count={count} limit={limit} page={page} onNewPage={this.queryNewPage} />
      </div>
    );
  }
});

export default connect()(List);
