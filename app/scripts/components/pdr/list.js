'use strict';
import React from 'react';
import { connect } from 'react-redux';
import omit from 'lodash.omit';
import {
  searchPdrs,
  clearPdrsSearch,
  listPdrs,
  filterPdrs,
  clearPdrsFilter
} from '../../actions';
import { pdrSearchResult, lastUpdated } from '../../utils/format';
import { tableHeader, tableRow, tableSortProps, bulkActions } from '../../utils/table-config/pdrs';
import LogViewer from '../logs/viewer';
import Dropdown from '../form/dropdown';
import Search from '../form/search';
import List from '../table/list-view';
import { pdrStatus as statusOptions } from '../../utils/status';
const processingOptions = omit(statusOptions, ['Completed', 'Failed']);
const processingStatus = Object.keys(processingOptions).map(d => processingOptions[d]).filter(Boolean).join(',');

var ActivePdrs = React.createClass({
  displayName: 'ActivePdrs',

  propTypes: {
    location: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    pdrs: React.PropTypes.object,
    logs: React.PropTypes.object
  },

  generateQuery: function () {
    const query = {};
    const { pathname } = this.props.location;
    if (pathname === '/pdrs/completed') query.status = 'completed';
    else if (pathname === '/pdrs/failed') query.status = 'failed';
    else if (pathname === '/pdrs/active') query.status__in = processingStatus;
    return query;
  },

  getView: function () {
    const { pathname } = this.props.location;
    if (pathname === '/pdrs/completed') return 'Completed';
    else if (pathname === '/pdrs/failed') return 'Failed';
    else if (pathname === '/pdrs/active') return 'Active';
    else return 'All';
  },

  generateBulkActions: function () {
    return bulkActions(this.props.pdrs);
  },

  render: function () {
    const { list } = this.props.pdrs;
    const { count, queriedAt } = list.meta;
    const logsQuery = { 'meta.pdrName__exists': 'true' };
    const view = this.getView();
    return (
      <div className='page__component'>
        <section className='page__section'>
          <div className='page__section__header'>
            <h1 className='heading--large heading--shared-content with-description'>{view} PDRs {!isNaN(count) ? `(${count})` : null}</h1>
            {lastUpdated(queriedAt)}
          </div>
          <div className='filters'>
            {view === 'All' ? (
              <Dropdown
                dispatch={this.props.dispatch}
                options={statusOptions}
                action={filterPdrs}
                clear={clearPdrsFilter}
                paramKey={'status'}
                label={'Status'}
              />
            ) : null}
            <Search dispatch={this.props.dispatch}
              action={searchPdrs}
              format={pdrSearchResult}
              clear={clearPdrsSearch}
            />
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
        </section>
        <LogViewer query={logsQuery} dispatch={this.props.dispatch} logs={this.props.logs}/>
      </div>
    );
  }
});

export default connect(state => state)(ActivePdrs);
