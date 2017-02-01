'use strict';
import React from 'react';
import { connect } from 'react-redux';

var ActiveCollections = React.createClass({
  displayName: 'ActiveCollections',

  render: function () {
    return (
      <div className='page__component'>
        <h1>These are active collections</h1>
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
          <button className='button button--small form-group__element'>Delete</button>
          <div className='dropdown__wrapper form-group__element form-group__element--small'>
            <select>
              <option value="week">Change Ingest Status</option>
              <option value="month">Last Month</option>
              <option value="year">Last Year</option>
            </select>
          </div>
        </div>
      </div>
    );
  }
});

export default connect(state => state)(ActiveCollections);
