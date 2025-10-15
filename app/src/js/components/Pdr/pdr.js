import path from 'path';
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useRouteMatch, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
import Checkbox from '../Checkbox/Checkbox';

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

const PDR = () => {
  const dispatch = useDispatch();

  const collections = useSelector(state => state.collections);
  const granules = useSelector(state => state.granules);
  const logs = useSelector(state => state.logs);
  const pdrs = useSelector(state => state.pdrs);
  const queryParams = useSelector(state => state.router.params);

  const routeMatch = useRouteMatch();
  const { pdrName } = routeMatch.params;

  const [isInfixSearch, setIsInfixSearch] = useState(false);

  useEffect(() => {
    dispatch(getPdr(pdrName));
  }, [dispatch, pdrName]);

  const handleDeletePdr = () => {
    dispatch(deletePdr(pdrName));
  };

  const navigateBack = () => {
    historyPushWithQueryParams('/pdrs');
  };

  const generateQuery = () => ({
    ...queryParams,
    pdrName,
  });

  const generateBulkActions = () => {
    return granuleBulkActions(granules);
  };

  const renderPdrProgress = (record) => (
    <div className="pdr__progress">
      {renderProgress(get(record, 'data', {}))}
    </div>
  );

  const record = pdrs.map[pdrName];

  if (!record || (record.inflight && !record.data)) {
    return <Loading />;
  }

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
            action={handleDeletePdr}
            success={navigateBack}
            status={deleteStatus}
            className={'form-group__element--right'}
            confirmAction={true}
            confirmText={deleteText(pdrName)}
            text={deleteStatus === 'success' ? 'Deleted!' : 'Delete'}
          />
          {lastUpdated(queriedAt)}
          {renderPdrProgress(record)}
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
          query={generateQuery()}
          bulkActions={generateBulkActions()}
          rowId="granuleId"
          tableId={`pdr-${pdrName}`}
        >
          <Search
            action={searchGranules}
            clear={clearGranulesSearch}
            labelKey="granuleId"
            searchKey="granules"
            infixBoolean={isInfixSearch}
          />
          <ListFilters>
            <Checkbox
              id="chk_isInfixSearch"
              checked={isInfixSearch}
              onChange={setIsInfixSearch}
              label="Search By"
              inputLabel="Infix"
              className="infix-search"
              tip="Toggle between prefix and infix search. When enabled, the search field matches substrings instead of prefixes."
            />
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
        dispatch={dispatch}
        logs={logs}
        notFound={`No recent logs for ${pdrName}`}
      />
    </div>
  );
};

export default PDR;
