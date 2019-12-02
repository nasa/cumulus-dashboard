'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  searchGranules,
  clearGranulesSearch,
  filterGranules,
  clearGranulesFilter,
  listGranules,
  getOptionsCollectionName,
  listWorkflows,
  applyWorkflowToGranule,
  interval
} from '../../actions';
import { get } from 'object-path';
import { lastUpdated, tally, displayCase } from '../../utils/format';
import {
  tableHeader,
  tableRow,
  tableSortProps,
  errorTableHeader,
  errorTableRow,
  errorTableSortProps,
  bulkActions,
  simpleDropdownOption
} from '../../utils/table-config/granules';
import List from '../Table/Table';
import LogViewer from '../Logs/viewer';
import Dropdown from '../DropDown/dropdown';
import Search from '../Search/search';
import statusOptions from '../../utils/status';
import { strings } from '../locale';
import { updateInterval } from '../../config';
import { workflowOptionNames } from '../../selectors';

class AllGranules extends React.Component {
  constructor () {
    super();
    this.displayName = strings.all_granules;
    this.queryWorkflows = this.queryWorkflows.bind(this);
    this.generateQuery = this.generateQuery.bind(this);
    this.generateBulkActions = this.generateBulkActions.bind(this);
    this.selectWorkflow = this.selectWorkflow.bind(this);
    this.applyWorkflow = this.applyWorkflow.bind(this);
    this.getExecuteOptions = this.getExecuteOptions.bind(this);
    this.getView = this.getView.bind(this);
    this.state = {};
  }

  componentDidMount () {
    this.cancelInterval = interval(this.queryWorkflows, updateInterval, true);
  }

  componentWillUnmount () {
    if (this.cancelInterval) { this.cancelInterval(); }
  }

  queryWorkflows () {
    this.props.dispatch(listWorkflows());
  }

  generateQuery () {
    const options = {};
    const view = this.getView();
    if (view === 'completed') options.status = 'completed';
    else if (view === 'processing') options.status = 'running';
    else if (view === 'failed') options.status = 'failed';
    return options;
  }

  generateBulkActions () {
    const config = {
      execute: {
        options: this.getExecuteOptions(),
        action: this.applyWorkflow
      }
    };
    const { granules } = this.props;
    return bulkActions(granules, config);
  }

  selectWorkflow (selector, workflow) {
    this.setState({ workflow });
  }

  applyWorkflow (granuleId) {
    return applyWorkflowToGranule(granuleId, this.state.workflow);
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

  getView () {
    const { pathname } = this.props.location;
    if (pathname === '/granules/completed') return 'completed';
    else if (pathname === '/granules/processing') return 'processing';
    else if (pathname === '/granules/failed') return 'failed';
    else return 'all';
  }

  render () {
    const { granules } = this.props;
    const { list, dropdowns } = granules;
    const { count, queriedAt } = list.meta;
    const logsQuery = { 'granuleId__exists': 'true' };
    const view = this.getView();
    const statOptions = (view === 'all') ? statusOptions : null;
    const tableSortIdx = view === 'failed' ? 3 : 6;
    return (
      <div className='page__component'>
        <section className='page__section page__section__header-wrapper'>
          <div className='page__section__header'>
            <h1 className='heading--large heading--shared-content with-description '>
              {displayCase(view)} {strings.granules} <span className='num--title'>{ !isNaN(count) ? `${tally(count)}` : null }</span>
            </h1>
            {lastUpdated(queriedAt)}
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
            {statOptions ? (
              <Dropdown
                options={statOptions}
                action={filterGranules}
                clear={clearGranulesFilter}
                paramKey={'status'}
                label={'Status'}
              />
            ) : null}
            <Search dispatch={this.props.dispatch}
              action={searchGranules}
              clear={clearGranulesSearch}
            />
          </div>

          <List
            list={list}
            action={listGranules}
            tableHeader={view === 'failed' ? errorTableHeader : tableHeader}
            tableRow={view === 'failed' ? errorTableRow : tableRow}
            tableSortProps={view === 'failed' ? errorTableSortProps : tableSortProps}
            query={this.generateQuery()}
            bulkActions={this.generateBulkActions()}
            rowId={'granuleId'}
            sortIdx={tableSortIdx}
          />
        </section>
        <LogViewer
          query={logsQuery}
          dispatch={this.props.dispatch}
          logs={this.props.logs}
          notFound={'No recent logs for granules'}
        />
      </div>
    );
  }
}

AllGranules.propTypes = {
  granules: PropTypes.object,
  logs: PropTypes.object,
  dispatch: PropTypes.func,
  location: PropTypes.object,
  workflowOptions: PropTypes.array
};

export default connect(state => ({
  logs: state.logs,
  granules: state.granules,
  workflowOptions: workflowOptionNames(state)
}))(AllGranules);
