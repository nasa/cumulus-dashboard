'use strict';
import React from 'react';
import { connect } from 'react-redux';
import omit from 'lodash.omit';
import {
  searchGranules,
  clearGranulesSearch,
  filterGranules,
  clearGranulesFilter,
  listGranules,
  getOptionsCollectionName
} from '../../actions';
import { get } from 'object-path';
import { granuleSearchResult, dropdownOption, lastUpdated } from '../../utils/format';
import { tableHeader, tableRow, tableSortProps, bulkActions } from '../../utils/table-config/granules';
import List from '../table/list-view';
import LogViewer from '../logs/viewer';
import Dropdown from '../form/dropdown';
import Search from '../form/search';
import statusOptions from '../../utils/status';
const processingOptions = omit(statusOptions, ['Completed', 'Failed']);
const processingStatus = Object.keys(processingOptions).map(d => processingOptions[d]).filter(Boolean).join(',');

var AllGranules = React.createClass({
  displayName: 'AllGranules',

  propTypes: {
    granules: React.PropTypes.object,
    logs: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    location: React.PropTypes.object
  },

  generateQuery: function () {
    const { pathname } = this.props.location;
    const options = {};
    if (pathname === '/granules/completed') options.status = 'completed';
    else if (pathname === '/granules/processing') options.status__in = processingStatus;
    else if (pathname === '/granules/failed') options.status = 'failed';
    return options;
  },

  generateBulkActions: function () {
    const { granules } = this.props;
    return bulkActions(granules);
  },

  getView: function () {
    const { pathname } = this.props.location;
    if (pathname === '/granules/completed') return 'Completed';
    else if (pathname === '/granules/processing') return 'Processing';
    else if (pathname === '/granules/failed') return 'Failed';
    else return 'All';
  },

  render: function () {
    const { list, dropdowns } = this.props.granules;
    const { count, queriedAt } = list.meta;
    const logsQuery = { 'meta.granuleId__exists': 'true' };
    const view = this.getView();
    const StatOptions = view === 'Completed' || view === 'Failed'
      ? null : view === 'Processing' ? processingOptions : statusOptions;

    return (
      <div className='page__component'>
        <section className='page__section'>
          <div className='page__section__header'>
            <h1 className='heading--large heading--shared-content with-description '>
              {view} Granules <span style={{color: 'gray'}}>{ !isNaN(count) ? `(${count})` : null }</span>
            </h1>
            {lastUpdated(queriedAt)}
          </div>
          <div className='filters filters__wlabels'>
            <Dropdown
              dispatch={this.props.dispatch}
              getOptions={getOptionsCollectionName}
              options={get(dropdowns, ['collectionName', 'options'])}
              format={dropdownOption}
              action={filterGranules}
              clear={clearGranulesFilter}
              paramKey={'collectionName'}
              label={'Collection'}
            />
            {StatOptions ? (
              <Dropdown
                dispatch={this.props.dispatch}
                options={StatOptions}
                format={dropdownOption}
                action={filterGranules}
                clear={clearGranulesFilter}
                paramKey={'status'}
                label={'Status'}
              />
            ) : null}
            <Search dispatch={this.props.dispatch}
              action={searchGranules}
              format={granuleSearchResult}
              clear={clearGranulesSearch}
            />
          </div>

          <List
            list={list}
            dispatch={this.props.dispatch}
            action={listGranules}
            tableHeader={tableHeader}
            tableRow={tableRow}
            tableSortProps={tableSortProps}
            query={this.generateQuery()}
            bulkActions={this.generateBulkActions()}
            rowId={'granuleId'}
          />
        </section>
        <LogViewer query={logsQuery} dispatch={this.props.dispatch} logs={this.props.logs}/>
      </div>
    );
  }
});

export default connect(state => state)(AllGranules);
