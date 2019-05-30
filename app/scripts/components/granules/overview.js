'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  interval,
  getCount,
  searchGranules,
  clearGranulesSearch,
  filterGranules,
  clearGranulesFilter,
  listGranules,
  listWorkflows,
  applyWorkflowToGranule,
  applyRecoveryWorkflow,
  getOptionsCollectionName
} from '../../actions';
import { get } from 'object-path';
import { lastUpdated, tally, displayCase } from '../../utils/format';
import {
  tableHeader,
  tableRow,
  tableSortProps,
  simpleDropdownOption,
  bulkActions,
  recoverAction
} from '../../utils/table-config/granules';
import List from '../table/list-view';
import Dropdown from '../form/dropdown';
import Search from '../form/search';
import Overview from '../app/overview';
import statusOptions from '../../utils/status';
import { updateInterval } from '../../config';
import { strings } from '../locale';
import { workflowOptionNames } from '../../selectors';

class GranulesOverview extends React.Component {
  constructor () {
    super();
    this.renderOverview = this.renderOverview.bind(this);
    this.generateQuery = this.generateQuery.bind(this);
    this.generateBulkActions = this.generateBulkActions.bind(this);
    this.queryMeta = this.queryMeta.bind(this);
    this.selectWorkflow = this.selectWorkflow.bind(this);
    this.applyWorkflow = this.applyWorkflow.bind(this);
    this.getExecuteOptions = this.getExecuteOptions.bind(this);
    this.applyRecoveryWorkflow = this.applyRecoveryWorkflow.bind(this);
    this.state = {};
  }

  componentDidMount () {
    this.cancelInterval = interval(this.queryMeta, updateInterval, true);
  }

  componentWillUnmount () {
    if (this.cancelInterval) { this.cancelInterval(); }
  }

  queryMeta () {
    this.props.dispatch(listWorkflows());
    this.props.dispatch(getCount({
      type: 'granules',
      field: 'status'
    }));
  }

  generateQuery () {
    return {};
  }

  generateBulkActions () {
    const actionConfig = {
      execute: {
        options: this.getExecuteOptions(),
        action: this.applyWorkflow
      },
      recover: {
        options: this.getExecuteOptions(),
        action: this.applyRecoveryWorkflow
      }
    };
    const { granules, config } = this.props;
    let actions = bulkActions(granules, actionConfig);
    if (config.recoveryPath) {
      actions = actions.concat(recoverAction(granules, actionConfig));
    }
    return actions;
  }

  selectWorkflow (selector, workflow) {
    this.setState({ workflow });
  }

  applyWorkflow (granuleId) {
    return applyWorkflowToGranule(granuleId, this.state.workflow);
  }

  applyRecoveryWorkflow (granuleId) {
    return applyRecoveryWorkflow(granuleId);
  }

  getExecuteOptions () {
    return [
      simpleDropdownOption({
        handler: this.selectWorkflow,
        label: 'workflow',
        value: this.state.workflow,
        options: this.props.workflowOptions
      })
    ];
  }

  renderOverview (count) {
    const overview = count.map(d => [tally(d.count), displayCase(d.key)]);
    return <Overview items={overview} inflight={false} />;
  }

  render () {
    const { stats, granules } = this.props;
    const { list, dropdowns } = granules;
    const { count, queriedAt } = list.meta;
    return (
      <div className='page__component'>
        <section className='page__section page__section__header-wrapper'>
          <div className='page__section__header'>
            <h1 className='heading--large heading--shared-content with-description '>{strings.granule_overview}</h1>
            {lastUpdated(queriedAt)}
            {this.renderOverview(get(stats, 'count.data.granules.count', []))}
          </div>
        </section>
        <section className='page__section'>
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium heading--shared-content with-description'>{strings.granules} <span className='num--title'>{count ? ` (${tally(count)})` : null}</span></h2>
          </div>
          <div className='filters filters__wlabels'>
            <Dropdown
              getOptions={getOptionsCollectionName}
              options={get(dropdowns, ['collectionName', 'options'])}
              action={filterGranules}
              clear={clearGranulesFilter}
              paramKey={'collectionId'}
              label={strings.collection}
            />
            <Dropdown
              options={statusOptions}
              action={filterGranules}
              clear={clearGranulesFilter}
              paramKey={'status'}
              label={'Status'}
            />
            <Search dispatch={this.props.dispatch}
              action={searchGranules}
              clear={clearGranulesSearch}
            />
          </div>

          <List
            list={list}
            action={listGranules}
            tableHeader={tableHeader}
            tableRow={tableRow}
            tableSortProps={tableSortProps}
            query={this.generateQuery()}
            bulkActions={this.generateBulkActions()}
            rowId={'granuleId'}
            sortIdx={6}
          />
        </section>
      </div>
    );
  }
}

GranulesOverview.propTypes = {
  granules: PropTypes.object,
  stats: PropTypes.object,
  dispatch: PropTypes.func,
  workflowOptions: PropTypes.array,
  location: PropTypes.object,
  config: PropTypes.object
};

export { GranulesOverview };
export default connect(state => ({
  stats: state.stats,
  workflowOptions: workflowOptionNames(state),
  granules: state.granules,
  config: state.config
}))(GranulesOverview);
