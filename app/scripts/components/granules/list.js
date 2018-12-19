'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
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
import List from '../table/list-view';
import LogViewer from '../logs/viewer';
import Dropdown from '../form/dropdown';
import Search from '../form/search';
import statusOptions from '../../utils/status';
import { strings } from '../locale';
import { updateInterval } from '../../config';
import { workflowOptionNames } from '../../selectors';

var AllGranules = createReactClass({
  displayName: strings.all_granules,

  propTypes: {
    granules: PropTypes.object,
    logs: PropTypes.object,
    dispatch: PropTypes.func,
    location: PropTypes.object,
    workflowOptions: PropTypes.array
  },

  componentWillMount: function () {
    this.setState({});
    this.cancelInterval = interval(this.queryWorkflows, updateInterval, true);
  },

  componentWillUnmount: function () {
    if (this.cancelInterval) { this.cancelInterval(); }
  },

  queryWorkflows: function () {
    this.props.dispatch(listWorkflows());
  },

  generateQuery: function () {
    const options = {};
    const view = this.getView();
    if (view === 'completed') options.status = 'completed';
    else if (view === 'processing') options.status = 'running';
    else if (view === 'failed') options.status = 'failed';
    return options;
  },

  generateBulkActions: function () {
    const config = {
      execute: {
        options: this.getExecuteOptions(),
        action: this.applyWorkflow
      }
    };
    const { granules } = this.props;
    return bulkActions(granules, config);
  },

  selectWorkflow: function (selector, workflow) {
    this.setState({ workflow });
  },

  applyWorkflow: function (granuleId) {
    return applyWorkflowToGranule(granuleId, this.state.workflow);
  },

  getExecuteOptions: function () {
    return [
      simpleDropdownOption({
        handler: this.selectWorkflow,
        label: 'workflow',
        value: this.state.workflow,
        options: this.props.workflowOptions
      })
    ];
  },

  getView: function () {
    const { pathname } = this.props.location;
    if (pathname === '/granules/completed') return 'completed';
    else if (pathname === '/granules/processing') return 'processing';
    else if (pathname === '/granules/failed') return 'failed';
    else return 'all';
  },

  render: function () {
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
              {displayCase(view)} {strings.granules} <span className='num--title'>{ !isNaN(count) ? `(${tally(count)})` : null }</span>
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
});

export default connect(state => ({
  logs: state.logs,
  granules: state.granules,
  workflowOptions: workflowOptionNames(state)
}))(AllGranules);
