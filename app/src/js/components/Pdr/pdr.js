'use strict';
import path from 'path';
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
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
  nullValue,
  fullDate,
  seconds,
  collectionLink,
  displayCase,
  bool,
  deleteText
} from '../../utils/format';
import { tableColumns, bulkActions } from '../../utils/table-config/pdrs';
import { renderProgress } from '../../utils/table-config/pdr-progress';
import List from '../Table/Table';
import LogViewer from '../Logs/viewer';
import Dropdown from '../DropDown/dropdown';
import Search from '../Search/search';
import status from '../../utils/status';
import Metadata from '../Table/Metadata';
import Loading from '../LoadingIndicator/loading-indicator';
import AsyncCommand from '../AsyncCommands/AsyncCommands';
import ErrorReport from '../Errors/report';
import GranulesProgress from '../Granules/progress';
import _config from '../../config';
import {strings} from '../locale';

const { updateInterval } = _config;

const metaAccessors = [
  ['Provider', 'provider', (d) => <Link to={`providers/provider/${d}`}>{d}</Link>],
  [strings.collection, 'collectionId', collectionLink],
  ['Execution', 'execution', (d) => d ? <Link to={`/executions/execution/${path.basename(d)}`}>link</Link> : nullValue],
  ['Status', 'status', displayCase],
  ['Timestamp', 'timestamp', fullDate],
  ['Created at', 'createdAt', fullDate],
  ['Duration', 'duration', seconds],
  ['PAN Sent', 'PANSent', bool],
  ['PAN Message', 'PANmessage']
];

class PDR extends React.Component {
  constructor () {
    super();
    this.reload = this.reload.bind(this);
    this.deletePdr = this.deletePdr.bind(this);
    this.generateQuery = this.generateQuery.bind(this);
    this.navigateBack = this.navigateBack.bind(this);
    this.generateBulkActions = this.generateBulkActions.bind(this);
    this.renderProgress = this.renderProgress.bind(this);
  }

  componentDidMount () {
    const { pdrName } = this.props.params;
    const immediate = !this.props.pdrs.map[pdrName];
    this.reload(immediate);
  }

  componentWillUnmount () {
    if (this.cancelInterval) { this.cancelInterval(); }
  }

  reload (immediate) {
    const { pdrName } = this.props.params;
    const { dispatch } = this.props;
    if (this.cancelInterval) { this.cancelInterval(); }
    this.cancelInterval = interval(() => dispatch(getPdr(pdrName)), updateInterval, immediate);
  }

  deletePdr () {
    const { pdrName } = this.props.params;
    this.props.dispatch(deletePdr(pdrName));
  }

  generateQuery () {
    const pdrName = get(this.props, ['params', 'pdrName']);
    return { pdrName };
  }

  navigateBack () {
    this.props.history.push('/pdrs');
  }

  generateBulkActions () {
    const { granules } = this.props;
    return bulkActions(granules);
  }

  renderProgress (record) {
    return (
      <div className='pdr__progress'>
        {renderProgress(get(record, 'data', {}))}
      </div>
    );
  }

  render () {
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
            <h2 className='heading--medium heading--shared-content with-description'>{strings.granules} <span className='num--title'>{ !isNaN(count) ? `(${count})` : null }</span></h2>
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
              label={strings.collection}
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
            tableColumns={tableColumns}
            query={this.generateQuery()}
            bulkActions={this.generateBulkActions()}
            rowId='granuleId'
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
}

PDR.propTypes = {
  granules: PropTypes.object,
  logs: PropTypes.object,
  pdrs: PropTypes.object,
  dispatch: PropTypes.func,
  params: PropTypes.object,
  history: PropTypes.object
};

export default withRouter(connect(state => state)(PDR));
