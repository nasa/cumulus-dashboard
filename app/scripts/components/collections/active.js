'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { listCollections } from '../../actions';
import * as format from '../../utils/format';

import SortableTable from '../table/sortable';

const tableHeader = [
  'Name',
  'Errors',
  'User Name',
  'Granules',
  'Duration',
  'Last Update'
];

const tableRow = [
  'collectionName',
  () => 1,
  'changedBy',
  () => 1,
  () => '0:03:00',
  (d) => format.fullDate(d.updatedAt)
];

var ActiveCollections = React.createClass({
  displayName: 'ActiveCollections',

  propTypes: {
    api: React.PropTypes.object,
    dispatch: React.PropTypes.func
  },

  componentWillReceiveProps: function (props) {
    // TODO this just keeps it from requesting endlessly,
    // obviously we want to use some kind of other check.
    if (!this.props.api.collections.length) {
      this.list();
    }
  },

  componentWillMount: function () {
    this.list();
  },

  list: function () {
    this.props.dispatch(listCollections());
  },

  render: function () {
    const data = this.props.api.collections;

    return (
      <div className='page__component'>
        <section className='page__section'>
          <h1 className='heading--large heading--shared-content'>Active Collections</h1>
          <Link className='button button--green button--small form-group__element--right' to=''>Edit</Link>
          <dl className="metadata__updated">
            <dt>Last Updated:</dt>
            <dd>Sept. 23, 2016</dd>
            <dd className='metadata__updated__time'>2:00pm EST</dd>
          </dl>
          <div className='filters'>
            <form className="search__wrapper form-group__element" onSubmit="">
              <input className='search' type="search" />
              <span className="search__icon"></span>
            </form>
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
          </div>
          <div className='form--controls'>
            <label className='form__element__select form-group__element form-group__element--small'><input type="checkbox" name="Select" value="Select" />Select</label>
            <button className='button button--small form-group__element button--green'>Delete</button>
            <div className='dropdown__wrapper form-group__element form-group__element--small'>
              <select>
                <option value="week">Change Ingest Status</option>
                <option value="month">Last Month</option>
                <option value="year">Last Year</option>
              </select>
            </div>
          </div>
        </section>
        <section className='page__section'>
          <div className='pagination'>
            <ol>
              <li><a className='previous' href="/">Previous</a></li>
              <li><a className='active' href="/">1</a></li>
              <li><a href="/">2</a></li>
              <li><a href="/">3</a></li>
              <li><a href="/">4</a></li>
              <li><a href="/">5</a></li>
              <li><a className='next' href="/">Next</a></li>
            </ol>
          </div>
        </section>
        <SortableTable data={data} header={tableHeader} row={tableRow}/>
      </div>
    );
  }
});

export default connect(state => state)(ActiveCollections);
