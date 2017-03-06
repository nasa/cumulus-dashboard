'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { listCollections, searchCollections, clearCollectionsSearch } from '../../actions';
import * as format from '../../utils/format';
import Pagination from '../app/pagination';
import Loading from '../app/loading-indicator';
import SortableTable from '../table/sortable';
import Search from '../form/search';
import { selectAll } from '../../utils/select';

const tableHeader = [
  '',
  'Name',
  'Status',
  'Errors',
  'User Name',
  'Granules',
  'Duration',
  'Last Update'
];

const tableRow = [
  (d) => <input type='checkbox' className='form-checkbox'/>,
  (d) => <Link to={`/collections/collection/${d.collectionName}`}>{d.collectionName}</Link>,
  'status',
  () => 0,
  'changedBy',
  (d) => format.tally(d.granules),
  (d) => format.seconds(d.averageDuration),
  (d) => format.fullDate(d.updatedAt)
];

var ActiveCollections = React.createClass({
  displayName: 'ActiveCollections',

  getInitialState: function () {
    return {
      page: 1
    };
  },

  propTypes: {
    collections: React.PropTypes.object,
    dispatch: React.PropTypes.func
  },

  componentWillReceiveProps: function (newProps) {
    const newPage = newProps.collections.list.meta.page;
    if (newPage) {
      this.setState({ page: newPage });
    }
  },

  componentWillMount: function () {
    this.list(this.state.page);
  },

  list: function (page) {
    this.props.dispatch(listCollections({ page }));
  },

  queryNewPage: function (page) {
    this.list(page);
  },

  render: function () {
    const { list, search } = this.props.collections;
    const { count, limit, queriedAt } = list.meta;
    const { page } = this.state;
    const primaryIdx = 1;

    return (
      <div className='page__component'>
        <section className='page__section'>
          <div className='page__section__header'>
            <h1 className='heading--large heading--shared-content'>Active Collections</h1>
            <Link className='button button--green button--small form-group__element--right' to=''>Edit</Link>
            {format.lastUpdated(queriedAt)}
          </div>
          <div className='filters'>
            <div className='dropdown__wrapper form-group__element'>
              <select>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="year">Last Year</option>
              </select>
            </div>
            <div className='dropdown__wrapper form-group__element'>
              <select>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="year">Last Year</option>
              </select>
            </div>
            <Search dispatch={this.props.dispatch}
              action={searchCollections}
              results={search}
              format={format.collectionSearchResult}
              clear={clearCollectionsSearch}
            />
          </div>
          <div className='form--controls'>
            <label className='form__element__select form-group__element form-group__element--small'>
              <input type='checkbox' className='form-select__all' name='Select' value='Select' onClick={selectAll} />
              Select
            </label>
            <button className='button button--small form-group__element button--green'>Delete</button>
            <div className='dropdown__wrapper form-group__element form-group__element--small'>
              <select>
                <option value="week">Change Ingest Status</option>
                <option value="month">Last Month</option>
                <option value="year">Last Year</option>
              </select>
            </div>
          </div>
          {list.inflight ? <Loading /> : null}
          <SortableTable primaryIdx={primaryIdx} data={list.data} header={tableHeader} row={tableRow}/>
          <Pagination count={count} limit={limit} page={page} onNewPage={this.queryNewPage} />
        </section>
      </div>
    );
  }
});

export default connect(state => state)(ActiveCollections);
