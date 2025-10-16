import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, withRouter } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { get } from 'object-path';
import {
  searchGranules,
  clearGranulesSearch,
  filterGranules,
  clearGranulesFilter,
  listGranules,
  listWorkflows,
  applyWorkflowToGranule,
  applyRecoveryWorkflowToGranule,
  getOptionsCollectionName,
  getOptionsProviderName,
  toggleGranulesTableColumns,
} from '../../actions';
import { lastUpdated, tally } from '../../utils/format';
import {
  bulkActions,
  defaultHiddenColumns,
  defaultWorkflowMeta,
  executeDialog,
  groupAction,
  recoverAction,
  tableColumns,
} from '../../utils/table-config/granules';
import { granuleStatus as statusOptions } from '../../utils/status';
import { strings } from '../locale';
import { workflowOptionNames } from '../../selectors';
import List from '../Table/Table';
import Dropdown from '../DropDown/dropdown';
import Search from '../Search/search';
import Overview from '../Overview/overview';
import ListFilters from '../ListActions/ListFilters';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import Checkbox from '../Checkbox/Checkbox';

const breadcrumbConfig = [
  {
    label: 'Dashboard Home',
    href: '/',
  },
  {
    label: 'Granules',
    active: true,
  },
];

const GranulesOverview = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const collections = useSelector(state => state.collections);
  const config = useSelector(state => state.config);
  const granules = useSelector(state => state.granules);
  const providers = useSelector(state => state.providers);
  const workflowOptions = useSelector(workflowOptionNames);

  const queryParams = Object.fromEntries(new URLSearchParams(location.search));

  const [workflow, setWorkflow] = useState(workflowOptions[0]);
  const [workflowMeta, setWorkflowMeta] = useState(defaultWorkflowMeta);
  const [selected, setSelected] = useState([]);
  const [isInfixSearch, setIsInfixSearch] = useState(false);

  useEffect(() => {
    dispatch(listWorkflows());
  }, [dispatch]);

  useEffect(() => {
    if (workflowOptions && workflowOptions.length > 0) {
      setWorkflow(workflowOptions[0]);
    }
  }, [workflowOptions]);

  const selectWorkflow = useCallback((_selector, newWorkflow) => {
    setWorkflow(newWorkflow);
  }, []);

  const metaHandler = useCallback((newWorkflowMeta) => {
    setWorkflowMeta(newWorkflowMeta);
  }, []);

  const applyWorkflow = useCallback((granuleId) => {
    const { meta } = JSON.parse(workflowMeta);
    setWorkflowMeta(defaultWorkflowMeta);
    return applyWorkflowToGranule(granuleId, workflow, meta);
  }, [workflow, workflowMeta]);

  const applyRecoveryWorkflow = useCallback((granuleId) => {
    return applyRecoveryWorkflowToGranule(granuleId);
  }, []);

  const getExecuteOptions = useCallback(() => [
    executeDialog({
      selectHandler: selectWorkflow,
      label: 'workflow',
      value: workflow,
      options: workflowOptions,
      initialMeta: workflowMeta,
      metaHandler: metaHandler,
    }),
  ], [workflow, workflowOptions, workflowMeta, selectWorkflow, metaHandler]);

  const generateBulkActions = useCallback(() => {
    const actionConfig = {
      execute: {
        options: getExecuteOptions(),
        action: applyWorkflow,
      },
      recover: {
        options: getExecuteOptions(),
        action: applyRecoveryWorkflow,
      },
    };
    let actions = bulkActions(granules, actionConfig, selected);
    if (config.enableRecovery) {
      actions = actions.concat(recoverAction(granules, actionConfig));
    }
    return actions;
  }, [granules, config, selected, getExecuteOptions, applyWorkflow, applyRecoveryWorkflow]);

  const generateQuery = useCallback(() => ({ ...queryParams }), [queryParams]);

  const updateSelection = useCallback((selectedIds, currentSelectedRows) => {
    const allSelectedRows = [...selected, ...currentSelectedRows];
    const newSelected = selectedIds
      .map((id) => allSelectedRows.find((g) => g.granuleId === id))
      .filter(Boolean);
    setSelected(newSelected);
  }, [selected]);

  const { list } = granules;
  const { dropdowns } = collections;
  const { dropdowns: providerDropdowns } = providers;
  const { count, queriedAt } = list.meta;

  return (
    <div className="page__component">
      <Helmet>
        <title> Granules Overview </title>
      </Helmet>
      <section className="page__section page__section__controls">
        <Breadcrumbs config={breadcrumbConfig} />
      </section>
      <section className="page__section page__section__header-wrapper">
        <div className="page__section__header">
          <h1 className="heading--large heading--shared-content with-description ">
            Granule Overview
          </h1>
          {lastUpdated(queriedAt)}
          <Overview type="granules" inflight={granules.list.inflight} />
        </div>
      </section>
      <section className="page__section">
        <div className="heading__wrapper--border">
          <h2 className="heading--medium heading--shared-content with-description">
            {strings.granules}{' '}
            <span className="num-title">
              {count ? ` ${tally(count)}` : 0}
            </span>
          </h2>
        </div>
        <List
          list={list}
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
          onSelect={updateSelection}
          toggleColumnOptionsAction={toggleGranulesTableColumns}
          tableId="granules-overview"
        >
          <Search
            action={searchGranules}
            clear={clearGranulesSearch}
            label="Search"
            labelKey="granuleId"
            placeholder="Granule ID"
            searchKey="granules"
            infixBoolean={isInfixSearch}
          />
          <ListFilters>
            <Checkbox
              id="chk_isInfixSearch"
              checked={isInfixSearch}
              onChange={() => setIsInfixSearch(!isInfixSearch)}
              label="Search By"
              inputLabel="Infix"
              className="infix-search"
              tip="Toggle between prefix and infix search. When enabled, the search field matches substrings instead of prefixes."
            />
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
              getOptions={getOptionsCollectionName}
              options={get(dropdowns, ['collectionName', 'options'])}
              action={filterGranules}
              clear={clearGranulesFilter}
              paramKey="collectionId"
              label={strings.collection}
              inputProps={{
                placeholder: 'All',
                className: 'dropdown--large',
              }}
            />
            <Dropdown
              getOptions={getOptionsProviderName}
              options={get(providerDropdowns, ['provider', 'options'])}
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

export default GranulesOverview;