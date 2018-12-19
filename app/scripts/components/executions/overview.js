'use strict';
import React from 'react';
import { get } from 'object-path';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {
  interval,
  getCount,

  listExecutions,
  filterExecutions,
  clearExecutionsFilter,

  listCollections,
  listWorkflows
} from '../../actions';
import {
  fromNow,
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
import Overview from '../app/overview';
import { updateInterval } from '../../config';
import {strings} from '../locale';

const tableHeader = [
  'Name',
  'Status',
  'Type',
  'Created',
  'Duration',
  strings.collection_name
];

const tableRow = [
  (d) => <Link to={'/executions/execution/' + d.arn} title={d.name}>{truncate(d.name, 24)}</Link>,
  (d) => displayCase(d.status),
  'type',
  (d) => fromNow(d.createdAt),
  (d) => seconds(d.duration),
  'collectionId'
];

const tableSortProps = [
  'name',
  'status',
  'type',
  'createdAt',
  'duration',
  strings.collection_id
];

var ExecutionOverview = createReactClass({
  propTypes: {
    dispatch: PropTypes.func,
    stats: PropTypes.object,
    executions: PropTypes.object,
    collectionOptions: PropTypes.object,
    workflowOptions: PropTypes.object
  },

  componentWillMount: function () {
    // use a slightly slower update interval, since the dropdown fields
    // will change less frequently.
    this.cancelInterval = interval(this.queryMeta, updateInterval, true);
  },

  componentWillUnmount: function () {
    if (this.cancelInterval) { this.cancelInterval(); }
  },

  queryMeta: function () {
    this.props.dispatch(listCollections({
      limit: 100,
      fields: 'name,version'
    }));
    this.props.dispatch(listWorkflows());
    this.props.dispatch(getCount({
      type: 'executions',
      field: 'status'
    }));
  },

  renderOverview: function (count) {
    const overview = count.map(d => [tally(d.count), displayCase(d.key)]);
    return <Overview items={overview} inflight={false} />;
  },

  render: function () {
    const { stats, executions } = this.props;
    const { list } = executions;
    const { count, queriedAt } = list.meta;
    return (
      <div className='page__component'>
        <section className='page__section page__section__header-wrapper'>
          <div className='page__section__header'>
            <h1 className='heading--large heading--shared-content with-description'>Execution Overview</h1>
            {lastUpdated(queriedAt)}
            {this.renderOverview(get(stats, 'count.data.executions.count', []))}
          </div>
        </section>
        <section className='page__section'>
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium heading--shared-content with-description'>All Executions <span className='num--title'>{count ? ` (${tally(count)})` : null}</span></h2>
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
              label={strings.collection}
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
            sortIdx={3}
          />
        </section>
      </div>
    );
  }
});

export default connect(state => ({
  stats: state.stats,
  executions: state.executions,
  workflowOptions: workflowOptions(state),
  collectionOptions: collectionOptions(state)
}))(ExecutionOverview);
