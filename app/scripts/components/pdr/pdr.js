'use strict';
import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import {
  interval,
  getPdr,
  searchGranules,
  clearGranulesSearch,
  filterGranules,
  clearGranulesFilter,
  listGranules,
  getOptionsCollectionName,
  reprocessGranule,
  removeGranule,
  deleteGranule
} from '../../actions';
import { get } from 'object-path';
import {
  granuleSearchResult,
  dropdownOption,
  lastUpdated,
  link,
  fullDate,
  tally,
  seconds,
  truthy,
  displayCase,
  bool
} from '../../utils/format';
import { tableHeader, tableRow, tableSortProps } from '../../utils/table-config/granules';
import List from '../table/list-view';
import LogViewer from '../logs/viewer';
import Dropdown from '../form/dropdown';
import Search from '../form/search';
import status from '../../utils/status';
import Metadata from '../table/metadata';
import Loading from '../app/loading-indicator';
import { updateInterval } from '../../config';

const metaAccessors = [
  ['Provider', 'provider', (d) => <Link to={`providers/provider/${d}`}>{d}</Link>],
  ['Original URL', 'originalUrl', link],
  ['Status', 'status', displayCase],
  ['Active', 'isActive', bool],
  ['Discovered at', 'discoveredAt', fullDate],
  ['Average Duration', 'averageDuration', seconds],
  ['Granules Count', 'granulesCount', tally],
  ['Granules', 'granules', tally],
  ['PAN', 'PAN', truthy],
  ['PAN Sent', 'PANSent', bool],
  ['PDRD', 'PDRD', truthy],
  ['PDRD Sent', 'PDRDSent', bool],
  ['Address', 'address']
];

var PDR = React.createClass({
  propTypes: {
    granules: React.PropTypes.object,
    logs: React.PropTypes.object,
    pdrs: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    params: React.PropTypes.object
  },

  componentWillMount: function () {
    const { pdrName } = this.props.params;
    const immediate = !this.props.pdrs.map[pdrName];
    this.reload(immediate);
  },

  componentWillUnmount: function () {
    if (this.cancelInterval) { this.cancelInterval(); }
  },

  reload: function (immediate) {
    const { pdrName } = this.props.params;
    const { dispatch } = this.props;
    if (this.cancelInterval) { this.cancelInterval(); }
    this.cancelInterval = interval(() => dispatch(getPdr(pdrName)), updateInterval, immediate);
  },

  generateQuery: function () {
    const pdrName = get(this.props, ['params', 'pdrName']);
    return { pdrName };
  },

  generateBulkActions: function () {
    const { granules } = this.props;
    return [{
      text: 'Reprocess',
      action: reprocessGranule,
      state: granules.reprocessed
    }, {
      text: 'Remove from CMR',
      action: removeGranule,
      state: granules.removed
    }, {
      text: 'Delete',
      action: deleteGranule,
      state: granules.deleted
    }];
  },

  render: function () {
    const { pdrName } = this.props.params;
    const { list, dropdowns } = this.props.granules;
    const { count, queriedAt } = list.meta;
    const record = this.props.pdrs.map[pdrName];
    console.log(record);
    const logsQuery = { 'meta.pdrName': pdrName };
    return (
      <div className='page__component'>
        <section className='page__section'>
          <div className='page__section__header'>
            <h1 className='heading--large heading--shared-content with-description '>{pdrName}</h1>
            {lastUpdated(queriedAt)}
          </div>
        </section>

          <section className='page__section'>
            <div className='heading__wrapper--border'>
              <h2 className='heading--medium with-description'>PDR Overview</h2>
            </div>
            {!record || (record.inflight && !record.data) ? <Loading /> : <Metadata data={record.data} accessors={metaAccessors} />}
          </section>

        <section className='page__section'>
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium heading--shared-content with-description'>Granules <span style={{color: 'gray'}}>{ count ? `(${count})` : null }</span></h2>
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
            <Dropdown
              dispatch={this.props.dispatch}
              options={status}
              format={dropdownOption}
              action={filterGranules}
              clear={clearGranulesFilter}
              paramKey={'status'}
              label={'Status'}
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
            bulkActions={this.generateBulkActions()}
            rowId={'granuleId'}
          />
        </section>
        <LogViewer query={logsQuery} dispatch={this.props.dispatch} logs={this.props.logs}/>
      </div>
    );
  }
});

export default connect(state => state)(PDR);
