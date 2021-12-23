import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { get } from 'object-path';
import {
  searchGranules,
  clearGranulesSearch,
  filterGranules,
  clearGranulesFilter,
  listGranules,
  getOptionsCollectionName,
  listWorkflows,
  applyWorkflowToGranule,
  getCount,
  getOptionsProviderName,
  toggleGranulesTableColumns,
} from '../../actions';
import { lastUpdated, tally, displayCase } from '../../utils/format';
import {
  defaultHiddenColumns,
  tableColumns,
  errorTableColumns,
  bulkActions,
  defaultWorkflowMeta,
  executeDialog,
  groupAction,
} from '../../utils/table-config/granules';
import List from '../Table/Table';
import LogViewer from '../Logs/viewer';
import Dropdown from '../DropDown/dropdown';
import Search from '../Search/search';
import { workflowOptionNames } from '../../selectors';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import ListFilters from '../ListActions/ListFilters';

const generateBreadcrumbConfig = (view) => [
  {
    label: 'Dashboard Home',
    href: '/',
  },
  {
    label: 'Granules',
    href: '/granules',
  },
  {
    label: view,
    active: true,
  },
];

const AllGranules = ({
  collections,
  dispatch,
  granules,
  match,
  queryParams,
  workflowOptions,
  stats,
  providers,
}) => {
  const [workflow, setWorkflow] = useState(workflowOptions[0]);
  const [workflowMeta, setWorkflowMeta] = useState(defaultWorkflowMeta);
  const [selected, setSelected] = useState([]);
  const { dropdowns } = collections;
  const { dropdowns: providerDropdowns } = providers;
  const { list } = granules;
  const { count, queriedAt } = list.meta;
  let {
    params: { status },
  } = match;
  status = status === 'processing' ? 'running' : status;
  const logsQuery = { granules__exists: 'true', executions__exists: 'true' };
  const query = generateQuery();
  const displayCaseView = displayCase(status);
  const tableSortId = status === 'failed' ? 'granuleId' : 'timestamp';
  const errorCount = get(stats, 'count.data.granules.count') || [];
  const breadcrumbConfig = generateBreadcrumbConfig(displayCaseView);

  useEffect(() => {
    dispatch(listWorkflows());
  }, [dispatch]);

  useEffect(() => {
    setWorkflow(workflowOptions[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(workflowOptions)]);

  useEffect(() => {
    dispatch(
      getCount({
        type: 'granules',
        field: 'error.Error.keyword',
        sidebarCount: false,
      })
    );
  }, [dispatch]);

  function generateQuery() {
    const options = { ...queryParams };
    options.status = status;
    return options;
  }

  function generateBulkActions() {
    const config = {
      execute: {
        options: getExecuteOptions(),
        action: applyWorkflow,
      },
    };
    return bulkActions(granules, config, selected);
  }

  function selectWorkflow(selector, selectedWorkflow) {
    setWorkflow(selectedWorkflow);
  }

  function applyWorkflow(granuleId) {
    const { meta } = JSON.parse(workflowMeta);
    setWorkflowMeta(defaultWorkflowMeta);
    return applyWorkflowToGranule(granuleId, workflow, meta);
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

  function getGranuleErrorTypes() {
    return errorCount.map((e) => ({
      id: e.key,
      label: e.key,
    }));
  }

  function updateSelection(selectedIds, currentSelectedRows) {
    const allSelectedRows = selected.concat(currentSelectedRows);
    const selectedRows = selectedIds
      .map((id) => allSelectedRows.find((g) => id === g.granuleId))
      .filter(Boolean);
    setSelected(selectedRows);
  }

  return (
    <div className="page__component">
      <section className="page__section">
        <section className="page__section page__section__controls">
          <Breadcrumbs config={breadcrumbConfig} />
        </section>
        <div className="page__section__header page__section__header-wrapper">
          <h1 className="heading--large heading--shared-content with-description ">
            {displayCaseView} Granules{' '}
            <span className="num-title">
              {!Number.isNaN(+count) ? `${tally(count)}` : 0}
            </span>
          </h1>
          {lastUpdated(queriedAt)}
        </div>
      </section>
      <section className="page__section">
        <List
          list={list}
          action={listGranules}
          tableColumns={status === 'failed' ? errorTableColumns : tableColumns}
          query={query}
          bulkActions={generateBulkActions()}
          groupAction={groupAction}
          rowId="granuleId"
          initialHiddenColumns={defaultHiddenColumns}
          initialSortId={tableSortId}
          filterAction={filterGranules}
          filterClear={clearGranulesFilter}
          onSelect={updateSelection}
          toggleColumnOptionsAction={toggleGranulesTableColumns}
          tableId="granules"
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
              getOptions={getOptionsCollectionName}
              options={get(dropdowns, ['collectionName', 'options']) || []}
              action={filterGranules}
              clear={clearGranulesFilter}
              paramKey="collectionId"
              label="Collection"
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
            {status === 'failed' && (
              <Dropdown
                options={getGranuleErrorTypes()}
                action={filterGranules}
                clear={clearGranulesFilter}
                paramKey="error.Error"
                label="Error Type"
                inputProps={{
                  placeholder: 'All',
                }}
              />
            )}
          </ListFilters>
        </List>
      </section>
      <LogViewer
        query={logsQuery}
        dispatch={dispatch}
        notFound="No recent logs for granules"
      />
    </div>
  );
};

AllGranules.propTypes = {
  collections: PropTypes.object,
  dispatch: PropTypes.func,
  granules: PropTypes.object,
  match: PropTypes.object,
  queryParams: PropTypes.object,
  workflowOptions: PropTypes.array,
  stats: PropTypes.object,
  providers: PropTypes.object,
};

export { AllGranules };

export default withRouter(
  connect((state) => ({
    collections: state.collections,
    granules: state.granules,
    stats: state.stats,
    workflowOptions: workflowOptionNames(state),
    providers: state.providers,
  }))(AllGranules)
);
