'use strict';
import React from 'react';
import pickBy from 'lodash.pickby';
import SortableTable from './sortable';
import Pagination from '../app/pagination';
import Loading from '../app/loading-indicator';
import ErrorReport from '../errors/report';
import BatchAsyncCommand from '../form/batch-async-command';
import { updateInterval } from '../../config';
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
      seconds: updateInterval / 1000,
      isAutoRunning: true,
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
    this.list();
  },

  componentWillUnmount: function () {
    if (this.cancelInterval) { this.cancelInterval(); }
  },

  componentWillReceiveProps: function (newProps) {
    if (JSON.stringify(newProps.query) !== JSON.stringify(this.props.query)) {
      this.list({}, newProps.query);
    }

    const nonNullParams = pickBy(newProps.list.params, v => (!undef(v) && v !== null));
    if (JSON.stringify(nonNullParams) !== JSON.stringify(this.state.params)) {
      this.setState({ params: nonNullParams }, () => this.list());
    }

    if (newProps.list.error && this.cancelInterval) {
      this.cancelInterval();
      this.cancelInterval = null;
    }
  },

  queryNewPage: function (page) {
    this.setState({ page });
    this.list({ page });
    this.setState({selected: []});
  },

  queryNewSort: function (sortProps) {
    this.setState(sortProps);
    this.list({ order: sortProps.order, sort_by: this.getSortProp(sortProps.sortIdx) });
    this.setState({selected: []});
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
      this.setState({ selected: selected.filter(d => d === id) });
    }
  },

  list: function (options, query) {
    options = options || {};
    const { page, order, sort_by, params } = options;

    // attach page, and sort properties using the current state
    if (undef(page)) { options.page = this.state.page; }
    if (undef(order)) { options.order = this.state.order; }
    if (undef(sort_by)) { options.sort_by = this.getSortProp(this.state.sortIdx); }

    if (undef(params)) { Object.assign(options, this.state.params); }

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
    this.cancelInterval = this.timedInterval(() => dispatch(action(options)), updateInterval / 1000);
  },

  timedInterval: function (action, seconds) {
    action();
    const intervalId = setInterval(() => {
      this.setState({ seconds: seconds });
      if (seconds === 0) {
        seconds = updateInterval / 1000;
        action();
      } else {
        seconds -= 1;
      }
    }, 1000);
    return () => clearInterval(intervalId);
  },

  toggleAutoFetch: function () {
    if (this.state.isAutoRunning) {
      if (this.cancelInterval) { this.cancelInterval(); }
      this.setState({ seconds: -1, isAutoRunning: false });
    } else {
      this.setState({ seconds: 0, isAutoRunning: true });
      this.list();
    }
  },

  render: function () {
    const { dispatch, tableHeader, tableRow, tableSortProps, bulkActions, rowId, list } = this.props;
    const { count, limit } = list.meta;
    const { page, sortIdx, order, selected, seconds } = this.state;
    const primaryIdx = 0;
    const allChecked = this.state.selected.length === list.data.length && list.data.length;
    const hasActions = !!(Array.isArray(bulkActions) && bulkActions.length);

    return (
      <div className='list-view'>
        <div className={hasActions ? 'form__element__updateToggle' : 'form__element__updateToggle form__element__updateToggle-noHeader'} onClick={this.toggleAutoFetch}>
          <div className='form-group__updating'>
            Next update in: {seconds === -1 ? '-' : seconds }
          </div>
          <i className='metadata__updated'>
            {seconds === -1 ? 'Start automatic updates' : 'Stop automatic updates'}
          </i>
        </div>

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
