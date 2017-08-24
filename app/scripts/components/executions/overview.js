'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  listExecutions,
  filterExecutions,
  clearExecutionsFilter
} from '../../actions';
import {
  fullDate,
  seconds,
  tally,
  lastUpdated,
  displayCase,
  truncate
} from '../../utils/format';
import statusOptions from '../../utils/status';
import List from '../table/list-view';
import Dropdown from '../form/dropdown';

const tableHeader = [
  'Name',
  'Status',
  'Type',
  'Created',
  'Duration',
  'Collection'
];

const tableRow = [
  (d) => <a href={d.execution} title={d.name}>{truncate(d.name, 24)}</a>,
  (d) => displayCase(d.status),
  'type',
  (d) => fullDate(d.createdAt),
  (d) => seconds(d.duration),
  'collectionId'
];

const tableSortProps = [
  'name',
  'status',
  'type',
  'createdAt',
  'duration',
  'collectionId'
];

var ExecutionOverview = React.createClass({
  propTypes: {
    dispatch: PropTypes.func,
    executions: PropTypes.object
  },

  componentWillMount: function () {
    this.props.dispatch(listExecutions({}));
  },

  render: function () {
    const { list } = this.props.executions;
    const { count, queriedAt } = list.meta;
    return (
      <div className='page__component'>
        <section className='page__section page__section__header-wrapper'>
          <div className='page__section__header'>
            <h1 className='heading--large heading--shared-content with-description'>
              Executions Overview <span className='num--title'>{ !isNaN(count) ? `(${tally(count)})` : null }</span>
            </h1>
            {lastUpdated(queriedAt)}
          </div>

          <div className='filters filters__wlabels'>
            <Dropdown
              dispatch={this.props.dispatch}
              options={statusOptions}
              action={filterExecutions}
              clear={clearExecutionsFilter}
              paramKey={'status'}
              label={'Status'}
            />
          </div>

          <List
            list={list}
            dispatch={this.props.dispatch}
            action={listExecutions}
            tableHeader={tableHeader}
            tableRow={tableRow}
            tableSortProps={tableSortProps}
            query={{}}
            rowId={'name'}
            sortIdx={2}
          />
        </section>
      </div>
    );
  }
});

export default connect(state => ({
  executions: state.executions
}))(ExecutionOverview);
