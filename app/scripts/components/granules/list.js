'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { interval, listGranules } from '../../actions';
import SortableTable from '../table/sortable';
import { fullDate, seconds } from '../../utils/format';
import Pagination from '../app/pagination';
import Loading from '../app/loading-indicator';
import { updateInterval } from '../../config';

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

var AllGranules = React.createClass({
  displayName: 'AllGranules',

  getInitialState: function () {
    return {
      page: 1,
      pdrName: this.props.params.pdrName || NULL
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
  },

  componentWillUnmount: function () {
    if (this.cancelInterval) { this.cancelInterval(); }
  },

  list: function (options) {
    options = options || {};
    if (!options.page) { options.page = this.state.page; }
    if (options.pdrName !== NULL && this.state.pdrName) { options.pdrName = this.state.pdrName; }
    for (let key in options) { !options[key] && delete options[key]; }
    if (this.cancelInterval) { this.cancelInterval(); }
    const { dispatch } = this.props;
    this.cancelInterval = interval(() => dispatch(listGranules(options)), updateInterval, true);
  },

  queryNewPage: function (page) {
    this.list({ page });
  },

  render: function () {
    const { pdrName } = this.props.params;
    const { list } = this.props.granules;
    const { count, limit } = list.meta;
    const { page } = this.state;
    return (
      <div className='page__component'>
        <section className='page__section'>
          <h1 className='heading--large heading--shared-content'>
            {pdrName || 'All'} Granules <span style={{color: 'gray'}}>{ count ? `(${count})` : null }</span>
          </h1>
          <dl className='metadata__updated'>
            <dt>Last Updated:</dt>
            <dd>Sept. 23, 2016</dd>
            <dd className='metadata__updated__time'>2:00pm EST</dd>
          </dl>
          <hr />
          <div className='filters'>
            <label htmlFor='collectionFilter'>Collection</label>
            <div className='dropdown__wrapper form-group__element'>
              <select id='collectionFilter'>
                <option value='ASTER_1A_versionId_1'>ASTER_1A_versionId_1</option>
                <option value='TODO'>TODO</option>
              </select>
            </div>
            <form className='search__wrapper form-group__element--right' onSubmit=''>
              <input className='search' type='search' />
              <span className='search__icon'></span>
            </form>
          </div>
          <div className='form--controls'>
            <label className='form__element__select form-group__element form-group__element--small'><input type='checkbox' name='Select' value='Select' />Select</label>
            <button className='button button--small form-group__element'>Remove From CMR</button>
            <button className='button button--small form-group__element'>Reprocess</button>
          </div>
        </section>

        {list.inflight ? <Loading /> : null}
        <section className='page__section'>
          <Pagination count={count} limit={limit} page={page} onNewPage={this.queryNewPage} />
        </section>

        <SortableTable data={list.data} header={tableHeader} row={tableRow}/>
      </div>
    );
  }
});

export default connect(state => state)(AllGranules);
