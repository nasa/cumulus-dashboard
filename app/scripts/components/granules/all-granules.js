'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { searchGranules, clearGranulesSearch, filterGranules, clearGranulesFilter, listGranules } from '../../actions';
import { get } from 'object-path';
import { granuleSearchResult, dropdownOption, lastUpdated } from '../../utils/format';
import { tableHeader, tableRow, tableSortProps } from '../../utils/table-config/granules';
import List from '../table/list-view';
import LogViewer from '../logs/viewer';
import Dropdown from '../form/dropdown';
import Search from '../form/search';

var AllGranules = React.createClass({
  displayName: 'AllGranules',

  propTypes: {
    granules: React.PropTypes.object,
    logs: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    params: React.PropTypes.object
  },

  generateQuery: function () {
    const pdrName = get(this.props, ['params', 'pdrName']);
    const options = {};
    if (pdrName) { options.pdrName = pdrName; }
    return options;
  },

  render: function () {
    const { pdrName } = this.props.params;
    const { list } = this.props.granules;
    const { count, queriedAt } = list.meta;
    const logsQuery = { q: 'granuleId' };

    return (
      <div className='page__component'>
        <section className='page__section'>
          <div className='page__section__header'>
            <h1 className='heading--large heading--shared-content'>
              {pdrName || 'All'} Granules <span style={{color: 'gray'}}>{ count ? `(${count})` : null }</span>
            </h1>
            {lastUpdated(queriedAt)}
          </div>
          <div className='filters filters__wlabels'>
            <Dropdown
              dispatch={this.props.dispatch}
              // TO-DO: Populate this list of available collections using the API
              options={{'': '', 'AST_L1A__version__003': 'AST_L1A__version__003', 'Not a real collection': 'Not a real collection'}}
              format={dropdownOption}
              action={filterGranules}
              clear={clearGranulesFilter}
              paramKey={'collectionName'}
              label={'Collection'}
            />
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
            isRemovable={true}
            rowId={'granuleId'}
          />
        </section>
        <LogViewer query={logsQuery} dispatch={this.props.dispatch} logs={this.props.logs}/>
      </div>
    );
  }
});

export default connect(state => state)(AllGranules);
