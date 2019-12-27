'use strict';
import React from 'react';
// import { get } from 'object-path';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  clearOperationsFilter,
  filterOperations,
  searchOperations,
  clearOperationsSearch,
  getCount,
  getCumulusInstanceMetadata,
  interval,
  listCollections,
  listOperations,
  listWorkflows
} from '../../actions';
import {
  fromNow,
  tally,
  displayCase
} from '../../utils/format';
import {
  workflowOptions,
  collectionOptions
} from '../../selectors';
// import statusOptions from '../../utils/status';
import List from '../Table/Table';
import Dropdown from '../DropDown/dropdown';
import Search from '../Search/search';
import { updateInterval } from '../../config';
// import {strings} from '../locale';

const tableHeader = [
  'Status',
  'Async ID',
  'Description',
  'Type',
  'Created'
];

const statusOptions = {
  Running: 'running',
  Succeeded: 'succeeded',
  Task_failed: 'task_failed',
  Runner_failed: 'runner_failed'
};

const typeOptions = {
  BulkGranules: 'Bulk Granules',
  ESIndex: 'ES Index',
  BulkDelete: 'Bulk Delete',
  KinesisReplay: 'Kinesis Replay'
};

  // (d) => <Link to={'/executions/execution/' + d.arn} title={d.name}>{truncate(d.name, 24)}</Link>,

const tableRow = [
  (d) => displayCase(d.status),
  (d) => d.id,
  (d) => d.description,
  (d) => d.operationType,
  (d) => fromNow(d.createdAt)
];

const tableSortProps = [
  'status',
  'id',
  null,
  'operationType',
  'createdAt'
];

class OperationOverview extends React.Component {
  constructor (props) {
    super(props);
    this.queryMeta = this.queryMeta.bind(this);
    // this.renderOverview = this.renderOverview.bind(this);
    this.generateQuery = this.generateQuery.bind(this);
    this.filterOperations = this.filterOperations.bind(this);
    this.searchOperations = this.searchOperations.bind(this);
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

  generateQuery () {
    return {};
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

  filterOperations (list) {
    let newList = [];
    if (list.params.status) {
      newList = list.data.filter((item) => {
        if (item.status.toLowerCase() === list.params.status) return item;
      });
    }
    if (list.params.operationType) {
      if (list.params.status) {
        newList = newList.filter((item) => {
          if (item.operationType === list.params.operationType) return item;
        });
      } else {
        newList = list.data.filter((item) => {
          if (item.operationType === list.params.operationType) return item;
        });
      }
    }
    return newList;
  }

  searchOperations (list, prefix) {
    return list.filter((item) => {
      if (item.id.includes(prefix)) return item;
    });
  }

  render () {
    const { operations } = this.props;
    const { list } = operations;
    list.meta = {};
    if (list.params.status || list.params.operationType) {
      list.data = this.filterOperations(list);
    }
    if (list.params.prefix && list.params.prefix.value) {
      list.data = this.searchOperations(list.data, list.params.prefix.value);
    }
    const listCount = list.data.length;
    return (
      <div className='page__component'>
        <section className='page__section page__section__header-wrapper'>
          <div className='page__section__header'>
            <h1 className='heading--large heading--shared-content with-description'>Operations Overview</h1>
          </div>
        </section>
        <section className='page__section'>
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium heading--shared-content with-description'>All Operations <span className='num--title'>{tally(listCount)}</span></h2>
          </div>
          <div className='filters filters__wlabels'>
            <Search dispatch={this.props.dispatch}
              action={searchOperations}
              clear={clearOperationsSearch}
            />
            <Dropdown
              options={statusOptions}
              action={filterOperations}
              clear={clearOperationsFilter}
              paramKey={'status'}
              label={'Status'}
            />

            <Dropdown
              options={typeOptions}
              action={filterOperations}
              clear={clearOperationsFilter}
              paramKey={'operationType'}
              label={'Type'}
            />
          </div>

          <List
            list={list}
            dispatch={this.props.dispatch}
            action={listOperations}
            tableHeader={tableHeader}
            tableRow={tableRow}
            tableSortProps={tableSortProps}
            query={this.generateQuery()}
            rowId={'id'}
            sortIdx={4}
          />
        </section>
      </div>
    );
  }
}

OperationOverview.propTypes = {
  dispatch: PropTypes.func,
  stats: PropTypes.object,
  operations: PropTypes.object,
  collectionOptions: PropTypes.object,
  workflowOptions: PropTypes.object
};

export default connect(state => ({
  stats: state.stats,
  operations: state.operations,
  workflowOptions: workflowOptions(state),
  collectionOptions: collectionOptions(state)
}))(OperationOverview);
