'use strict';
import React from 'react';
import { get } from 'object-path';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  clearExecutionsFilter,
  filterExecutions,
  searchExecutions,
  clearExecutionsSearch,
  getCount,
  getCumulusInstanceMetadata,
  interval,
  listCollections,
  listExecutions,
  listWorkflows
} from '../../actions';
import {
  tally,
  lastUpdated,
  displayCase
} from '../../utils/format';
import {
  workflowOptions,
  collectionOptions
} from '../../selectors';
import statusOptions from '../../utils/status';
import List from '../Table/Table';
import Dropdown from '../DropDown/dropdown';
import Search from '../Search/search';
import Overview from '../Overview/overview';
import _config from '../../config';
import { strings } from '../locale';
import { tableColumns } from '../../utils/table-config/executions';

const { updateInterval } = _config;

class ExecutionOverview extends React.Component {
  constructor (props) {
    super(props);
    this.queryMeta = this.queryMeta.bind(this);
    this.renderOverview = this.renderOverview.bind(this);
    this.searchOperationId = this.searchOperationId.bind(this);
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

  searchOperationId (list, prefix) {
    return list.filter((item) => {
      if (item.asyncOperationId && item.asyncOperationId.includes(prefix)) return item;
    });
  }

  renderOverview (count) {
    const overview = count.map(d => [tally(d.count), displayCase(d.key)]);
    return <Overview items={overview} inflight={false} />;
  }

  render () {
    const { stats, executions } = this.props;
    const { list } = executions;
    const { count, queriedAt } = list.meta;
    if (list.prefix && list.prefix.value) {
      list.data = this.searchOperationId(list.data, list.prefix.value);
    }
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
            <h2 className='heading--medium heading--shared-content with-description'>All Executions <span className='num--title'>{count ? ` ${tally(count)}` : 0}</span></h2>
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

            <Search dispatch={this.props.dispatch}
              action={searchExecutions}
              clear={clearExecutionsSearch}
              paramKey={'asyncOperationId'}
              label={'Async Operation ID'}
            />
          </div>

          <List
            list={list}
            dispatch={this.props.dispatch}
            action={listExecutions}
            tableColumns={tableColumns}
            query={{}}
            rowId='name'
            sortIdx='createdAt'
          />
        </section>
      </div>
    );
  }
}

ExecutionOverview.propTypes = {
  dispatch: PropTypes.func,
  stats: PropTypes.object,
  executions: PropTypes.object,
  collectionOptions: PropTypes.object,
  workflowOptions: PropTypes.object
};

export default withRouter(connect(state => ({
  stats: state.stats,
  executions: state.executions,
  workflowOptions: workflowOptions(state),
  collectionOptions: collectionOptions(state)
}))(ExecutionOverview));
