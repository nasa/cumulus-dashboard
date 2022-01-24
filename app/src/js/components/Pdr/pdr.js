import path from 'path';
import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { get } from 'object-path';
import {
  getPdr,
  deletePdr,
  searchGranules,
  clearGranulesSearch,
  filterGranules,
  clearGranulesFilter,
  listGranules,
  getOptionsCollectionName,
} from '../../actions';
import {
  lastUpdated,
  nullValue,
  fullDate,
  seconds,
  collectionLink,
  displayCase,
  bool,
  deleteText,
} from '../../utils/format';
import { granuleTableColumns, granuleBulkActions } from '../../utils/table-config/pdrs';
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
import { strings } from '../locale';
import ListFilters from '../ListActions/ListFilters';
import { getPersistentQueryParams, historyPushWithQueryParams } from '../../utils/url-helper';

const metaAccessors = [
  {
    label: 'Provider',
    property: 'provider',
    accessor: (d) => (
      <Link
        to={(location) => ({
          pathname: `/providers/provider/${d}`,
          search: getPersistentQueryParams(location),
        })}
      >
        {d}
      </Link>
    ),
  },
  {
    label: strings.collection,
    property: 'collectionId',
    accessor: collectionLink,
  },
  {
    label: 'Execution',
    property: 'execution',
    accessor: (d) => (d
      ? (
      <Link
        to={(location) => ({
          pathname: `/executions/execution/${path.basename(d)}`,
          search: getPersistentQueryParams(location),
        })}
      >
        link
      </Link>
        )
      : (
          nullValue
        )),
  },
  {
    label: 'Status',
    property: 'status',
    accessor: displayCase,
  },
  {
    label: 'Timestamp',
    property: 'timestamp',
    accessor: fullDate,
  },
  {
    label: 'Created at',
    property: 'createdAt',
    accessor: fullDate,
  },
  {
    label: 'Duration',
    property: 'duration',
    accessor: seconds,
  },
  {
    label: 'PAN Sent',
    property: 'PANSent',
    accessor: bool,
  },
  {
    label: 'PAN Message',
    property: 'PANmessage',
  },
];

class PDR extends React.Component {
  constructor() {
    super();
    this.deletePdr = this.deletePdr.bind(this);
    this.generateQuery = this.generateQuery.bind(this);
    this.navigateBack = this.navigateBack.bind(this);
    this.generateBulkActions = this.generateBulkActions.bind(this);
    this.renderProgress = this.renderProgress.bind(this);
  }

  componentDidMount() {
    const { dispatch, match } = this.props;
    const { pdrName } = match.params;
    dispatch(getPdr(pdrName));
  }

  deletePdr() {
    const { pdrName } = this.props.match.params;
    this.props.dispatch(deletePdr(pdrName));
  }

  generateQuery() {
    const { queryParams } = this.props;
    const pdrName = get(this.props, ['match', 'params', 'pdrName']);
    return {
      ...queryParams,
      pdrName,
    };
  }

  navigateBack() {
    historyPushWithQueryParams('/pdrs');
  }

  generateBulkActions() {
    const { granules } = this.props;
    return granuleBulkActions(granules);
  }

  renderProgress(record) {
    return (
      <div className="pdr__progress">
        {renderProgress(get(record, 'data', {}))}
      </div>
    );
  }

  render() {
    const { match, granules, collections, pdrs } = this.props;
    const { pdrName } = match.params;
    const record = pdrs.map[pdrName];
    if (!record || (record.inflight && !record.data)) return <Loading />;
    const { dropdowns } = collections;
    const { list } = granules;
    const { count, queriedAt } = list.meta;
    const deleteStatus = get(pdrs.deleted, [pdrName, 'status']);
    const { error } = record;

    const granulesCount = get(record, 'data.stats', []);
    const granuleStatus = Object.keys(granulesCount).map((key) => ({
      count: granulesCount[key],
      key: (key === 'processing') ? 'running' : key
    }));

    return (
      <div className="page__component">
        <Helmet>
          <title> Cumulus PDRs </title>
        </Helmet>
        <section className="page__section page__section__header-wrapper">
          <div className="page__section__header">
            <h1 className="heading--large heading--shared-content with-description ">
              PDR: {pdrName}
            </h1>
            <AsyncCommand
              action={this.deletePdr}
              success={this.navigateBack}
              status={deleteStatus}
              className={'form-group__element--right'}
              confirmAction={true}
              confirmText={deleteText(pdrName)}
              text={deleteStatus === 'success' ? 'Deleted!' : 'Delete'}
            />
            {lastUpdated(queriedAt)}
            {this.renderProgress(record)}
            {error && <ErrorReport report={error} />}
          </div>
        </section>

        <section className="page__section">
          <div className="heading__wrapper--border">
            <h2 className="heading--medium with-description">PDR Overview</h2>
          </div>
          <Metadata data={record.data} accessors={metaAccessors} />
        </section>

        <section className="page__section">
          <div className="heading__wrapper--border">
            <h2 className="heading--medium heading--shared-content with-description">
              {strings.granules}{' '}
              <span className="num-title">
                {!Number.isNaN(+count) ? `(${count})` : 0}
              </span>
            </h2>
          </div>
          <div>
            <GranulesProgress granules={granuleStatus} />
          </div>

          <List
            list={list}
            action={listGranules}
            tableColumns={granuleTableColumns}
            query={this.generateQuery()}
            bulkActions={this.generateBulkActions()}
            rowId="granuleId"
            tableId={`pdr-${pdrName}`}
          >
            <Search
              action={searchGranules}
              clear={clearGranulesSearch}
              labelKey="granuleId"
              searchKey="granules"
            />
            <ListFilters>
              <Dropdown
                getOptions={getOptionsCollectionName}
                options={get(dropdowns, ['collectionName', 'options']) || []}
                action={filterGranules}
                clear={clearGranulesFilter}
                paramKey={'collectionId'}
                label={strings.collection}
                inputProps={{
                  placeholder: 'All',
                  className: 'dropdown--large',
                }}
              />
              <Dropdown
                options={status}
                action={filterGranules}
                clear={clearGranulesFilter}
                paramKey={'status'}
                label={'Status'}
              />
            </ListFilters>
          </List>
        </section>
        <LogViewer
          query={{ q: pdrName }}
          dispatch={this.props.dispatch}
          logs={this.props.logs}
          notFound={`No recent logs for ${pdrName}`}
        />
      </div>
    );
  }
}

PDR.propTypes = {
  collections: PropTypes.object,
  dispatch: PropTypes.func,
  granules: PropTypes.object,
  history: PropTypes.object,
  logs: PropTypes.object,
  match: PropTypes.object,
  pdrs: PropTypes.object,
  queryParams: PropTypes.object,
};

export default withRouter(
  connect((state) => ({
    collections: state.collections,
    granules: state.granules,
    logs: state.logs,
    pdrs: state.pdrs,
  }))(PDR)
);
