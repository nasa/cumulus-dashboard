'use strict';
import React from 'react';
import { get } from 'object-path';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {
  clearExecutionsFilter,
  filterExecutions,
  getCount,
  getCumulusInstanceMetadata,
  interval,
  listCollections,
  listExecutions,
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
import List from '../Table/Table';
import Dropdown from '../DropDown/dropdown';
import Overview from '../Overview/overview';
import { updateInterval } from '../../config';
import {strings} from '../locale';

const tableHeader = [
  'Status',
  'Async ID',
  'Description',
  'Type',
  'Duration',
  'Created'
];

const tableRow = [
  // (d) => <Link to={'/executions/execution/' + d.arn} title={d.name}>{truncate(d.name, 24)}</Link>,
  (d) => displayCase(d.status),
  (d) => <Link to={'/operations/operation/' + d.asyncOperationId} title={d.asyncOperationId}>d.asyncOperationId</Link>,
  'type',
  (d) => fromNow(d.createdAt),
  (d) => seconds(d.duration)
];

const tableSortProps = [
  'name',
  'status',
  'type',
  'createdAt',
  'duration'
];

class OperationOverview extends React.Component {
  constructor (props) {
    super(props);
    this.onlyAsync = this.onlyAsync.bind(this);
    //somehitng else
  }

  componentDidMount () {
    // use a slightly slower update interval, since the dropdown fields
    // will change less frequently.
    this.cancelInterval = interval(this.queryMeta, updateInterval, true);
    this.props.dispatch(getCumulusInstanceMetadata());
  }

  componentWillUnmount () {
    if (this.cancelInterval) { this.cancelInterval(); }
  }

  queryMeta () {
    this.props.dispatch(listCollections({
      limit: 100,
      fields: 'name,version'
    }));
    this.props.dispatch(listWorkflows());
    this.props.dispatch(getCount({
      type: 'executions',
      field: 'status'
    }));
  }

  onlyAsync (list) {
    const filteredList = list.data.map(d => {
      if (d.asyncOperationId) return d;
    });
    return filteredList;
  }

  renderOverview (count) {
    const overview = count.map(d => [tally(d.count), displayCase(d.key)]);
    return <Overview items={overview} inflight={false} />;
  }

  render () {
    const { stats, executions } = this.props;
    const { list } = executions;
    console.log('list', executions);
    const newList = {
      data: this.onlyAsync(list),
      meta: list.meta,
      error: list.error
    };
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
            <h2 className='heading--medium heading--shared-content with-description'>All Executions <span className='num--title'>{count ? ` ${tally(count)}` : null}</span></h2>
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
              options={this.props.workflowOptions}
              action={filterExecutions}
              clear={clearExecutionsFilter}
              paramKey={'type'}
              label={'Workflow'}
            />
          </div>

          <List
            list={newList}
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
}

OperationOverview.propTypes = {
  dispatch: PropTypes.func,
  stats: PropTypes.object,
  executions: PropTypes.object,
  collectionOptions: PropTypes.object,
  workflowOptions: PropTypes.object
};

export default connect(state => ({
  stats: state.stats,
  executions: state.executions,
  workflowOptions: workflowOptions(state),
  collectionOptions: collectionOptions(state)
}))(OperationOverview);
