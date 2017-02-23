'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { get } from 'object-path';
import { listPdrs } from '../../actions';
import SortableTable from '../table/sortable';
import { fullDate } from '../../utils/format';

const tableHeader = [
  'PDR',
  'Status',
  'Name',
  'Provider',
  'Granules',
  'Duration',
  'Added'
];

const tableRow = [
  () => 'TODO',
  () => 'TODO',
  'pdrName',
  () => 'TODO',
  (d) => Object.keys(get(d, 'granules', {})).length,
  () => 'TODO',
  (d) => fullDate(d.createdAt)
];

var PdrsOverview = React.createClass({
  displayName: 'PdrsOverview',

  propTypes: {
    dispatch: React.PropTypes.func,
    pdrs: React.PropTypes.object
  },

  componentWillMount: function () {
    this.list();
  },

  list: function () {
    this.props.dispatch(listPdrs());
  },

  render: function () {
    const data = this.props.pdrs.list;
    return (
      <div className='page__component'>
        <section className='page__section'>
          <h1 className='heading--large heading--shared-content'>PDR's Overview</h1>
          <dl className="metadata__updated">
            <dt>Last Updated:</dt>
            <dd>Sept. 23, 2016</dd>
            <dd className='metadata__updated__time'>2:00pm EST</dd>
          </dl>
          <hr />
        </section>
        <SortableTable data={data} header={tableHeader} row={tableRow}/>
      </div>
    );
  }
});

export default connect(state => state)(PdrsOverview);
