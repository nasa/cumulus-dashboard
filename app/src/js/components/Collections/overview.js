import React, { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { get } from 'object-path';
import {
  clearGranulesFilter,
  clearGranulesSearch,
  deleteCollection,
  filterGranules,
  getCollection,
  getCumulusInstanceMetadata,
  listGranules,
  searchGranules,
  listCollections,
  getOptionsProviderName,
  listWorkflows,
  applyWorkflowToGranule,
  applyRecoveryWorkflowToGranule,
} from '../../actions';
import {
  collectionName as collectionLabelForId,
  getCollectionId,
  getEncodedCollectionId,
  lastUpdated,
  collectionHrefFromNameVersion,
  collectionHrefFromId,
} from '../../utils/format';
import { granuleStatus as statusOptions } from '../../utils/status';
import {
  bulkActions,
  defaultHiddenColumns,
  defaultWorkflowMeta,
  executeDialog,
  groupAction,
  recoverAction,
  tableColumns,
} from '../../utils/table-config/granules';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import DeleteCollection from '../DeleteCollection/DeleteCollection';
import Dropdown from '../DropDown/dropdown';
import AsyncDropdown from '../DropDown/async-dropdown';
import ListFilters from '../ListActions/ListFilters';
import { strings } from '../locale';
import Overview from '../Overview/overview';
import Search from '../Search/search';
import List from '../Table/Table';
import { workflowOptionNames } from '../../selectors';
import { withUrlHelper } from '../../withUrlHelper';

const breadcrumbConfig = [
  {
    label: 'Dashboard Home',
    href: '/',
  },
  {
    label: 'Collections',
    href: '/collections/all',
  },
  {
    label: 'Collection Overview',
    active: true,
  },
];

const CollectionOverview = ({ urlHelper }) => {
  const dispatch = useDispatch();
  const {
    location,
    queryParams,
    params,
    getPersistentQueryParams,
    historyPushWithQueryParams
  } = urlHelper;

  const collections = useSelector((state) => state.collections);
  const datepicker = useSelector((state) => state.datepicker);
  const granules = useSelector((state) => state.granules);
  const providers = useSelector((state) => state.providers);
  const workflowOptions = useSelector(workflowOptionNames);

  const { deleted: deletedCollections, map: collectionsMap } = collections;
  const { list: granulesList } = granules;
  const { dropdowns } = providers;
  const { name: collectionName, version: collectionVersion } = params || {};
  const decodedVersion = decodeURIComponent(collectionVersion);
  const collectionId = getCollectionId({ name: collectionName, version: decodedVersion });
  const record = collectionsMap[collectionId];
  const deleteStatus = get(deletedCollections, [collectionId, 'status']);
  const hasGranules = get(collectionsMap[collectionId], 'data.stats.total', 0) > 0;

  const [workflow, setWorkflow] = useState(workflowOptions[0]);
  const [workflowMeta, setWorkflowMeta] = useState(defaultWorkflowMeta);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    dispatch(listCollections());
    dispatch(getCumulusInstanceMetadata());
    dispatch(getCollection(collectionName, decodedVersion));
  }, [collectionName, datepicker, decodedVersion, dispatch]);

  function changeCollection(_, newCollectionId) {
    historyPushWithQueryParams(collectionHrefFromId(newCollectionId));
  }

  useEffect(() => {
    dispatch(listWorkflows());
  }, [dispatch]);

  useEffect(() => {
    if (workflowOptions.length > 0 && !workflow) {
      setWorkflow(workflowOptions[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [(JSON.stringify(workflowOptions)), workflow]);

  function generateQuery() {
    return {
      ...queryParams,
      collectionId,
    };
  }

  function generateBulkActions() {
    const config = {
      execute: {
        options: getExecuteOptions(),
        action: applyWorkflow,
      },
      recover: {
        options: getExecuteOptions(),
        action: applyRecoveryWorkflow
      }
    };

    let actions = bulkActions(granules, config, selected);
    if (config.enableRecovery) {
      actions = actions.concat(recoverAction(granules, config));
    }
    return actions;
  }

  function selectWorkflow(selector, selectedWorkflow) {
    setWorkflow(selectedWorkflow);
  }

  function applyWorkflow(granuleId) {
    const { meta } = JSON.parse(workflowMeta);
    setWorkflowMeta(defaultWorkflowMeta);
    return applyWorkflowToGranule(granuleId, workflow, meta);
  }

  function applyRecoveryWorkflow(granuleId) {
    return applyRecoveryWorkflowToGranule(granuleId);
  }

  function getExecuteOptions() {
    return [
      executeDialog({
        selectHandler: selectWorkflow,
        label: 'workflow',
        value: workflow,
        options: workflowOptions,
        initialMeta: workflowMeta,
        metaHandler: setWorkflowMeta,
      }),
    ];
  }

  function deleteMe() {
    dispatch(deleteCollection(collectionName, decodedVersion));
  }

  function navigateBack() {
    historyPushWithQueryParams('/collections/all');
  }

  function gotoGranules() {
    historyPushWithQueryParams('/granules');
  }

  function onInputChange(inputValue) {
    return dispatch(listCollections({ infix: inputValue })).then((result) => result.data.results.map((collection) => ({
      label: getCollectionId(collection),
      value: getEncodedCollectionId(collection)
    })));
  }

  function errors() {
    return [
      get(collections.map, [collectionId, 'error']),
      get(collections.deleted, [collectionId, 'error']),
    ].filter(Boolean);
  } /* Look at incorporating granule action errors maybe? */

  function updateSelection(selectedIds, currentSelectedRows) {
    const allSelectedRows = selected.concat(currentSelectedRows);
    const selectedRows = selectedIds
      .map((id) => allSelectedRows.find((g) => id === g.granuleId)).filter(Boolean);
    setSelected(selectedRows);
  }

  return (
    <div className="page__component">
      <Helmet>
        <title> Collection Overview </title>
      </Helmet>
      <section className="page__section page__section__controls">
        <div className="collection__options--top">
          <ul>
            <li>
              <Breadcrumbs config={breadcrumbConfig} />
            </li>
            <li>
              <div className="dropdown__collection form-group__element--right">
                <AsyncDropdown
                  className='collection-chooser'
                  label={'Collection'}
                  title={'Collections Dropdown'}
                  onChange={changeCollection}
                  onInputChange={onInputChange}
                  value={collectionId}
                  defaultOptions={true}
                  id={'collection-chooser'}
                  cacheOptions={true}
                />
              </div>
            </li>
          </ul>
        </div>
      </section>
      <section className="page__section page__section__header-wrapper">
        <div className="heading-group">
          <ul className="heading-form-group--left">
            <li>
              <h1 className="heading--large heading--shared-content with-description">
                {strings.collection}: {collectionLabelForId(collectionId)}
              </h1>
            </li>
            <li>
              <Link
                className="button button--copy button--small button--green"
                to={{
                  pathname: '/collections/add',
                  search: getPersistentQueryParams(location),
                  state: {
                    name: collectionName,
                    version: decodedVersion,
                  },
                }}
              >
                Copy
              </Link>
            </li>
            <li>
              <Link
                className="button button--edit button--small button--green"
                to={{
                  pathname: `/collections/edit/${collectionName}/${collectionVersion}`,
                  search: getPersistentQueryParams(location),
                }}
              >
                Edit
              </Link>
            </li>
            <li>
              <DeleteCollection
                collectionId={collectionId}
                errors={errors()}
                hasGranules={hasGranules}
                onDelete={deleteMe}
                onGotoGranules={gotoGranules}
                onSuccess={navigateBack}
                status={deleteStatus}
              />
            </li>
          </ul>
          <span className="last-update">
            {lastUpdated(get(record, 'data.timestamp'))}
          </span>
        </div>
      </section>
      <section className="page__section page__section__overview">
        <div className="heading__wrapper--border">
          <h2 className="heading--large ">
            Granule Metrics
          </h2>
        </div>
        {record && <Overview type='granules' params={{ collectionId }} inflight={record.inflight} />}
      </section>
      <section className="page__section">
        <Outlet />
        <div className="heading__wrapper--border">
          <h2 className="heading--medium heading--shared-content with-description">
            {strings.total_granules}
            <span className="num-title">
              {granulesList.meta.count ? ` ${granulesList.meta.count}` : 0}
            </span>
          </h2>
          <Link
            className="button button--small button__goto button--green form-group__element--right"
            to={({
              pathname: `${collectionHrefFromNameVersion({ name: collectionName, version: collectionVersion })}/granules`,
              search: getPersistentQueryParams(location),
            })}
          >
            {strings.view_all_granules}
          </Link>
        </div>
        <List
          list={granulesList}
          action={listGranules}
          tableColumns={tableColumns}
          query={generateQuery()}
          bulkActions={generateBulkActions()}
          groupAction={groupAction}
          rowId="granuleId"
          initialHiddenColumns={defaultHiddenColumns}
          initialSortId="updatedAt"
          filterAction={filterGranules}
          filterClear={clearGranulesFilter}
          tableId={`collection-${collectionName}-${collectionVersion}`}
          onSelect={updateSelection}
        >
          <Search
            action={searchGranules}
            clear={clearGranulesSearch}
            label="Search"
            labelKey="granuleId"
            placeholder="Granule ID"
            searchKey="granules"
          />
          <ListFilters>
            <Dropdown
              options={statusOptions}
              action={filterGranules}
              clear={clearGranulesFilter}
              paramKey="status"
              label="Status"
              inputProps={{
                placeholder: 'All',
              }}
            />
            <Dropdown
              getOptions={getOptionsProviderName}
              options={get(dropdowns, ['provider', 'options'])}
              action={filterGranules}
              clear={clearGranulesFilter}
              paramKey="provider"
              label="Provider"
              inputProps={{
                placeholder: 'All',
                className: 'dropdown--medium',
              }}
            />
          </ListFilters>
        </List>
      </section>
    </div>
  );
};

CollectionOverview.propTypes = {
  collections: PropTypes.object,
  datepicker: PropTypes.object,
  granules: PropTypes.object,
  providers: PropTypes.object,
  workflowOptions: PropTypes.array,
  urlHelper: PropTypes.shape({
    location: PropTypes.object,
    queryParams: PropTypes.object,
    params: PropTypes.object,
    getPersistentQueryParams: PropTypes.func,
    historyPushWithQueryParams: PropTypes.func
  }),
};

export default withUrlHelper(CollectionOverview);
