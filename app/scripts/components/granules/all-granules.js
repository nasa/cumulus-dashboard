'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { listGranules } from '../../actions';
import SortableTable from '../table/sortable';
import { fullDate } from '../../utils/format';

const header = [
  'Name',
  'Status',
  'Collection',
  'Duration',
  'Updated'
];
const keys = [
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
    const granules = this.props.api.granules;

    return (
      <div className='page__component'>
        <SortableTable data={granules} header={header} row={keys}/>
      </div>
    );
  }
});

export default connect(state => state)(AllGranules);
