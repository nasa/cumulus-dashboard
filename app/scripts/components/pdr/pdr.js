'use strict';
import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import {
  interval,
  getPdr,
  deletePdr,
  searchGranules,
  clearGranulesSearch,
  filterGranules,
  clearGranulesFilter,
  listGranules,
  getOptionsCollectionName
} from '../../actions';
import { get } from 'object-path';
import {
  granuleSearchResult,
  lastUpdated,
  link,
  fullDate,
  tally,
  seconds,
  truthy,
  displayCase,
  bool,
  deleteText
} from '../../utils/format';
import { tableHeader, tableRow, tableSortProps, bulkActions } from '../../utils/table-config/granules';
import { renderProgress } from '../../utils/table-config/pdr-progress';
import List from '../table/list-view';
import LogViewer from '../logs/viewer';
import Dropdown from '../form/dropdown';
import Search from '../form/search';
import status from '../../utils/status';
import Metadata from '../table/metadata';
import Loading from '../app/loading-indicator';
import AsyncCommand from '../form/async-command';
import ErrorReport from '../errors/report';
import GranulesProgress from '../granules/progress';
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
    params: React.PropTypes.object,
    router: React.PropTypes.object
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

  deletePdr: function () {
    const { pdrName } = this.props.params;
    this.props.dispatch(deletePdr(pdrName));
  },

  generateQuery: function () {
    const pdrName = get(this.props, ['params', 'pdrName']);
    return { pdrName };
  },

  navigateBack: function () {
    this.props.router.push('/pdrs');
  },

  generateBulkActions: function () {
    const { granules } = this.props;
    return bulkActions(granules);
  },

  renderProgress: function (record) {
    return (
      <div className='pdr__progress'>
        {renderProgress(get(record, 'data', {}))}
      </div>
    );
  },

  render: function () {
    const { pdrName } = this.props.params;
    const { list, dropdowns } = this.props.granules;
    const { count, queriedAt } = list.meta;
    const record = this.props.pdrs.map[pdrName];
    const logsQuery = { 'meta.pdrName': pdrName };
    const deleteStatus = get(this.props.pdrs.deleted, [pdrName, 'status']);
    const error = record.error;

    const granulesCount = get(record, 'data.granulesStatus', []);
    const granuleStatus = Object.keys(granulesCount).map(key => ({
      count: granulesCount[key],
      key
    }));
    return (
      <div className='page__component'>
        <section className='page__section page__section__header-wrapper'>
          <div className='page__section__header'>
            <h1 className='heading--large heading--shared-content with-description '>{pdrName}</h1>
            <AsyncCommand action={this.deletePdr}
              success={this.navigateBack}
              status={deleteStatus}
              className={'form-group__element--right'}
              confirmAction={true}
              confirmText={deleteText(pdrName)}
              text={deleteStatus === 'success' ? 'Deleted!' : 'Delete'} />
            {lastUpdated(queriedAt)}
            {this.renderProgress(record)}
            {error ? <ErrorReport report={error} /> : null}
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
            <h2 className='heading--medium heading--shared-content with-description'>Granules <span className='num--title'>{ !isNaN(count) ? `(${count})` : null }</span></h2>
          </div>
          <div>
            <GranulesProgress granules={granuleStatus} />
          </div>
          <div className='filters filters__wlabels'>
            <Dropdown
              getOptions={getOptionsCollectionName}
              options={get(dropdowns, ['collectionName', 'options'])}
              action={filterGranules}
              clear={clearGranulesFilter}
              paramKey={'collectionName'}
              label={'Collection'}
            />
            <Dropdown
              options={status}
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
        <LogViewer
          query={logsQuery}
          dispatch={this.props.dispatch}
          logs={this.props.logs}
          notFound={`No recent logs for ${pdrName}`}
        />
      </div>
    );
  }
});

export default connect(state => state)(PDR);
