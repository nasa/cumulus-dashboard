'use strict';
import React from 'react';
import pickBy from 'lodash.pickby';
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
      sortIdx: 0,
      order: 'desc',
      selected: [],
      prefix: null,
      queryConfig: {},
      params: {}
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
    bulkActions: React.PropTypes.array,
    rowId: React.PropTypes.string
  },

  componentWillMount: function () {
    this.setState({ queryConfig: this.config() });
  },

  componentWillUnmount: function () {
    if (this.cancelInterval) { this.cancelInterval(); }
  },

  componentWillReceiveProps: function (newProps) {
    if (JSON.stringify(newProps.query) !== JSON.stringify(this.props.query)) {
      this.setState({ queryConfig: this.config({}, newProps.query) });
    }

    const params = pickBy(newProps.list.params, v => (!undef(v) && v !== null));
    if (JSON.stringify(params) !== JSON.stringify(this.state.params)) {
      this.setState({
        params,
        queryConfig: this.config({ params })
      });
    }

    if (newProps.list.error && this.cancelInterval) {
      this.cancelInterval();
      this.cancelInterval = null;
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
    const { data } = this.props.list;
    if (!data.length) return;
    const selected = this.state.selected.length === data.length;
    if (selected) {
      this.setState({ selected: [] });
    } else {
      this.setState({ selected: data.map(d => d[this.props.rowId]) });
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

  config: function (config, query) {
    config = config || {};
    const { page, order, sort_by, params } = config;

    // attach page, and sort properties using the current state
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
    for (let key in config) { !config[key] && delete config[key]; }
    return config;
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
    const { page, sortIdx, order, selected, queryConfig } = this.state;
    const primaryIdx = 0;
    const allChecked = this.state.selected.length === list.data.length && list.data.length;
    const hasActions = !!(Array.isArray(bulkActions) && bulkActions.length);

    return (
      <div className='list-view'>
        <Timer noheader={!hasActions} dispatch={dispatch} action={action} config={queryConfig} />
        {hasActions ? (
          <div className='form--controls'>
            <label className='form__element__select form-group__element form-group__element--small'>
              <input type='checkbox' className='form-select__all' name='Select' checked={allChecked} onChange={this.selectAll} />
              Select
            </label>
            {bulkActions.map((item, i) => <BatchAsyncCommand key={item.text}
              dispatch={dispatch}
              action={item.action}
              state={item.state}
              text={item.text}
              selection={selected}
            />)}
          </div>
        ) : null}

        {list.inflight ? <Loading /> : null}
        {list.error ? <ErrorReport report={list.error} /> : null}

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
          canSelect={hasActions}
          selectedRows={selected}
          rowId={rowId}
        />

        <Pagination count={count} limit={limit} page={page} onNewPage={this.queryNewPage} />
      </div>
    );
  }
});

export default List;
