'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  listExecutions,
  filterExecutions,
  clearExecutionsFilter,

  listCollections,
  listWorkflows,

  interval
} from '../../actions';
import {
  fullDate,
  seconds,
  tally,
  lastUpdated,
  displayCase,
  truncate
} from '../../utils/format';
import {
  workflowOptions,
  collectionOptions
} from '../../selectors';
import statusOptions from '../../utils/status';
import List from '../table/list-view';
import Dropdown from '../form/dropdown';
import { updateInterval } from '../../config';

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
    executions: PropTypes.object,
    collectionOptions: PropTypes.object,
    workflowOptions: PropTypes.object
  },

  componentWillMount: function () {
    // use a slightly slower update interval, since the dropdown fields
    // will change less frequently.
    this.cancelInterval = interval(this.queryDropdowns, updateInterval * 2, true);
  },

  componentWillUnmount: function () {
    if (this.cancelInterval) { this.cancelInterval(); }
  },

  // query dropdown fields
  queryDropdowns: function () {
    this.props.dispatch(listCollections({
      limit: 100,
      fields: 'name,version'
    }));
    this.props.dispatch(listWorkflows());
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
              options={statusOptions}
              action={filterExecutions}
              clear={clearExecutionsFilter}
              paramKey={'status'}
              label={'Status'}
            />

            <Dropdown
              options={this.props.collectionOptions}
              action={filterExecutions}
              clear={clearExecutionsFilter}
              paramKey={'collectionId'}
              label={'Collection'}
            />

            <Dropdown
              options={this.props.workflowOptions}
              action={filterExecutions}
              clear={clearExecutionsFilter}
              paramKey={'type'}
              label={'Workflow'}
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
  executions: state.executions,
  workflowOptions: workflowOptions(state),
  collectionOptions: collectionOptions(state)
}))(ExecutionOverview);
