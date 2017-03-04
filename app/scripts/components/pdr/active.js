'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { searchPdrs, clearPdrSearch, listPdrs } from '../../actions';
import { pdrSearchResult } from '../../utils/format';
import { tableHeader, tableRow, tableSortProps } from '../../utils/table-config/pdrs';
import LogViewer from '../logs/viewer';
import Search from '../form/search';
import List from '../table/list-view';

var ActivePdrs = React.createClass({
  displayName: 'ActivePdrs',

  propTypes: {
    dispatch: React.PropTypes.func,
    pdrs: React.PropTypes.object,
    logs: React.PropTypes.object
  },

  generateQuery: function () {
    return {};
  },

  render: function () {
    const { list, search } = this.props.pdrs;
    const { count } = list.meta;
    const logsQuery = { q: 'pdrName' };
    return (
      <div className='page__component'>
        <section className='page__section'>
          <div className='page__section__header'>
            <h1 className='heading--large heading--shared-content'>Active PDRs { count ? `(${count})` : null }</h1>
            <dl className='metadata__updated'>
              <dt>Last Updated:</dt>
              <dd>Sept. 23, 2016</dd>
              <dd className='metadata__updated__time'>2:00pm EST</dd>
            </dl>
          </div>
          <div className='filters'>
            <Search dispatch={this.props.dispatch}
              action={searchPdrs}
              results={search}
              format={pdrSearchResult}
              clear={clearPdrSearch}
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
