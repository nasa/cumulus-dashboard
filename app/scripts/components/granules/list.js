'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { listGranules } from '../../actions';
import SortableTable from '../table/sortable';
import { fullDate, seconds } from '../../utils/format';
import Pagination from '../app/pagination';

const tableHeader = [
  'Name',
  'Status',
  'PDR',
  'Collection',
  'Duration',
  'Updated'
];
const tableRow = [
  (d) => (<Link to={`/granules/granule/${d.collectionName}/${d.granuleId}/overview`}>{d.granuleId}</Link>),
  'status',
  'pdrName',
  'collectionName',
  (d) => seconds(d.duration),
  (d) => fullDate(d.updatedAt)
];

var AllGranules = React.createClass({
  displayName: 'AllGranules',

  getInitialState: function (props) {
    return {
      page: 1,
      pdrName: this.props.params.pdrName
    };
  },

  propTypes: {
    granules: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    params: React.PropTypes.object
  },

  componentWillMount: function () {
    this.list();
  },

  componentWillReceiveProps: function (newProps) {
    if (typeof newProps.granules.meta.page !== 'undefined') {
      this.setState({ page: newProps.granules.meta.page });
    }

    // check for pdr name param here, if it's there set state
  },

  list: function (options) {
    options = options || {};
    if (!options.page) { options.page = this.state.page; }
    if (this.state.pdrName) { options.pdrName = this.state.pdrName; }
    console.log(options);
    this.props.dispatch(listGranules(options));
  },

  queryNewPage: function (page) {
    this.list({ page });
  },

  render: function () {
    const { list, meta } = this.props.granules;
    const { count, limit } = meta;
    const { page } = this.state;
    return (
      <div className='page__component'>
        <section className='page__section'>
          <h1 className='heading--large heading--shared-content'>
            Granules <span style={{color: 'gray'}}>{ count ? `(${count})` : null }</span>
          </h1>
          <dl className="metadata__updated">
            <dt>Last Updated:</dt>
            <dd>Sept. 23, 2016</dd>
            <dd className='metadata__updated__time'>2:00pm EST</dd>
          </dl>
          <hr />
          <div className='filters'>
            <label htmlFor="collectionFilter">Collection</label>
            <div className='dropdown__wrapper form-group__element'>
              <select id="collectionFilter">
                <option value="ASTER_1A_versionId_1">ASTER_1A_versionId_1</option>
                <option value="TODO">TODO</option>
              </select>
            </div>
            <form className="search__wrapper form-group__element--right" onSubmit="">
              <input className='search' type="search" />
              <span className="search__icon"></span>
            </form>
          </div>
          <div className='form--controls'>
            <label className='form__element__select form-group__element form-group__element--small'><input type="checkbox" name="Select" value="Select" />Select</label>
            <button className='button button--small form-group__element'>Remove From CMR</button>
            <button className='button button--small form-group__element'>Reprocess</button>
          </div>
        </section>

        <section className='page__section'>
          <Pagination count={count} limit={limit} page={page} onNewPage={this.queryNewPage} />
        </section>

        <SortableTable data={list} header={tableHeader} row={tableRow}/>
      </div>
    );
  }
});

export default connect(state => state)(AllGranules);
