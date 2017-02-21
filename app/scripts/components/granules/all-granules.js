'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { listGranules } from '../../actions';
import SortableTable from '../table/sortable';
import { fullDate } from '../../utils/format';

const tableHeader = [
  'Name',
  'Status',
  'Collection',
  'Duration',
  'Updated'
];
const tableRow = [
  'granuleId',
  () => 'TODO',
  'collectionName',
  () => 'TODO',
  (d) => fullDate(d.updatedAt)
];

var AllGranules = React.createClass({
  displayName: 'AllGranules',

  propTypes: {
    api: React.PropTypes.object,
    dispatch: React.PropTypes.func
  },

  componentWillMount: function () {
    this.props.dispatch(listGranules());
  },

  render: function () {
    const granules = this.props.api.granules.results;
    const count = this.props.api.granules.meta.count;

    return (
      <div className='page__component'>
        <section className='page__section'>
          <h1 className='heading--large heading--shared-content'>
            Granules <span style={{color: 'gray'}}>({count})</span>
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
        </section>

        <SortableTable data={granules} header={tableHeader} row={tableRow}/>
      </div>
    );
  }
});

export default connect(state => state)(AllGranules);
