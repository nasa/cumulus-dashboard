'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { interval, listGranules, searchGranules, clearGranuleSearch } from '../../actions';
import SortableTable from '../table/sortable';
import { fullDate, seconds, granuleSearchResult } from '../../utils/format';
import Pagination from '../app/pagination';
import Loading from '../app/loading-indicator';
import ErrorReport from '../errors/report';
import LogViewer from '../logs/viewer';
import Search from '../form/search';
import { updateInterval } from '../../config';
import { isUndefined } from '../../utils/validate';

// distinguish between undefined and null parameters
const NULL = null;

const tableHeader = [
  'Name',
  'Status',
  'PDR',
  'Collection',
  'Duration',
  'Updated'
];
const tableRow = [
  (d) => <Link to={`/granules/granule/${d.granuleId}/overview`}>{d.granuleId}</Link>,
  'status',
  'pdrName',
  'collectionName',
  (d) => seconds(d.duration),
  (d) => fullDate(d.updatedAt)
];
const tableSortProps = [
  'granuleId.keyword',
  'statusId',
  'pdrName.keyword',
  'collectionName.keyword',
  'duration',
  'updatedAt'
];

var AllGranules = React.createClass({
  displayName: 'AllGranules',

  getInitialState: function () {
    return {
      page: 1,
      pdrName: this.props.params.pdrName || NULL,
      sortIdx: 0,
      order: 'desc',
      error: null
    };
  },

  propTypes: {
    granules: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    params: React.PropTypes.object,
    logs: React.PropTypes.object
  },

  componentWillMount: function () {
    this.list();
  },

  componentWillReceiveProps: function (newProps) {
    const newPage = newProps.granules.list.meta.page;
    if (newPage) {
      this.setState({ page: newPage });
    }

    let { pdrName } = newProps.params;
    pdrName = pdrName || NULL;
    if (pdrName !== this.state.pdrName) {
      this.setState({ pdrName });
      this.list({ pdrName });
    }

    const error = newProps.granules.list.error;
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
    if (options.pdrName !== NULL && this.state.pdrName) { options.pdrName = this.state.pdrName; }

    // remove empty keys so as not to mess up the query
    for (let key in options) { !options[key] && delete options[key]; }

    // stop the currently running auto-query
    if (this.cancelInterval) { this.cancelInterval(); }
    const { dispatch } = this.props;
    this.cancelInterval = interval(() => dispatch(listGranules(options)), updateInterval, true);

    // optimistically set error to null in case we hit something good.
    this.setState({ error: null });
  },

  queryNewPage: function (page) {
    this.list({ page });
  },

  setSort: function (sortProps) {
    this.setState(sortProps);
    this.list({
      order: sortProps.order,
      sort_by: tableSortProps[sortProps.sortIdx]
    });
  },

  render: function () {
    const { pdrName } = this.props.params;
    const { list, search } = this.props.granules;
    const { count, limit } = list.meta;
    const { error, page, sortIdx, order } = this.state;
    const logsQuery = { q: 'granuleId' };
    return (
      <div className='page__component'>
        <section className='page__section'>
          <div className='page__section__header'>
            <h1 className='heading--large heading--shared-content'>
              {pdrName || 'All'} Granules <span style={{color: 'gray'}}>{ count ? `(${count})` : null }</span>
            </h1>
            <dl className='metadata__updated'>
              <dt>Last Updated:</dt>
              <dd>Sept. 23, 2016</dd>
              <dd className='metadata__updated__time'>2:00pm EST</dd>
            </dl>
          </div>
          <div className='filters filters__wlabels'>
            <div className='filter__item'>
              <label htmlFor='collectionFilter'>Collection</label>
              <div className='dropdown__wrapper form-group__element'>
                <select id='collectionFilter'>
                  <option value='ASTER_1A_versionId_1'>ASTER_1A_versionId_1</option>
                  <option value='TODO'>TODO</option>
                </select>
              </div>
            </div>
            <div className='filter__item'>
              <Search dispatch={this.props.dispatch}
                action={searchGranules}
                results={search}
                format={granuleSearchResult}
                clear={clearGranuleSearch}
              />
            </div>
          </div>
          <div className='form--controls'>
            <label className='form__element__select form-group__element form-group__element--small'><input type='checkbox' name='Select' value='Select' />Select</label>
            <button className='button button--small form-group__element'>Remove From CMR</button>
            <button className='button button--small form-group__element'>Reprocess</button>
          </div>

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
          <Pagination count={count} limit={limit} page={page} onNewPage={this.queryNewPage} />
        </section>
        <LogViewer query={logsQuery} dispatch={this.props.dispatch} logs={this.props.logs}/>
      </div>
    );
  }
});

export default connect(state => state)(AllGranules);
