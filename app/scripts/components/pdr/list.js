'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { searchPdrs, clearPdrsSearch, listPdrs } from '../../actions';
import { pdrSearchResult, lastUpdated } from '../../utils/format';
import { tableHeader, tableRow, tableSortProps } from '../../utils/table-config/pdrs';
import LogViewer from '../logs/viewer';
import Search from '../form/search';
import List from '../table/list-view';

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
    const active = this.props.location.pathname.indexOf('active') >= 0;
    if (active) query.status__not = 'completed';
    else query.status = 'completed';
    return query;
  },

  render: function () {
    const { list } = this.props.pdrs;
    const { count, queriedAt } = list.meta;
    const logsQuery = { 'meta.pdrName__exists': 'true' };
    const active = this.props.location.pathname.indexOf('active') >= 0;
    return (
      <div className='page__component'>
        <section className='page__section'>
          <div className='page__section__header'>
            <h1 className='heading--large heading--shared-content with-description'>{active ? 'Active' : ' Completed'} PDRs { count ? `(${count})` : null }</h1>
            {lastUpdated(queriedAt)}
          </div>
          <div className='filters'>
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
          />
        </section>
        <LogViewer query={logsQuery} dispatch={this.props.dispatch} logs={this.props.logs}/>
      </div>
    );
  }
});

export default connect(state => state)(ActivePdrs);
