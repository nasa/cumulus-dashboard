import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getCollectionId, displayCase } from '../../utils/format';
import {
  listGranules,
  filterGranules,
  clearGranulesFilter,
  applyWorkflowToGranule,
  searchGranules,
  clearGranulesSearch,
  listWorkflows,
} from '../../actions';
import {
  defaultWorkflowMeta,
  executeDialog,
  bulkActions,
  tableColumns,
} from '../../utils/table-config/granules';
import List from '../Table/Table';
import Dropdown from '../DropDown/dropdown';
import Search from '../Search/search';
import statusOptions from '../../utils/status';
import { strings } from '../locale';
import { workflowOptionNames } from '../../selectors';
import ListFilters from '../ListActions/ListFilters';
import CollectionHeader from './collection-header';

const CollectionGranules = ({
  dispatch,
  granules,
  location,
  match,
  queryParams,
  workflowOptions,
}) => {
  const { params } = match;
  const { name: collectionName, version: collectionVersion } = params;
  const { pathname } = location;
  const { list } = granules;
  const { meta } = list;
  const displayName = strings.granules;
  const collectionId = getCollectionId(params);
  const view = getView();
  const [workflow, setWorkflow] = useState(workflowOptions[0]);
  const [workflowMeta, setWorkflowMeta] = useState(defaultWorkflowMeta);
  const query = generateQuery();

  const breadcrumbConfig = [
    {
      label: 'Collection Granules',
      href: `/collections/collection/${collectionName}/${collectionVersion}/granules`,
      active: view === 'all',
    },
  ];

  if (view !== 'all') {
    breadcrumbConfig.push({
      label: displayCase(view),
      active: true,
    });
  }

  useEffect(() => {
    dispatch(listWorkflows());
  }, [dispatch]);

  useEffect(() => {
    setWorkflow(workflowOptions[0]);
  }, [workflowOptions]);

  function generateQuery() {
    const options = {
      ...queryParams,
      collectionId,
    };
    if (view !== 'all') options.status = view;
    return options;
  }

  function getView() {
    if (pathname.includes('/granules/completed')) return 'completed';
    if (pathname.includes('/granules/processing')) return 'running';
    if (pathname.includes('/granules/failed')) return 'failed';
    return 'all';
  }

  function generateBulkActions() {
    const actionConfig = {
      execute: {
        options: getExecuteOptions(),
        action: applyWorkflow,
      },
    };

    return bulkActions(granules, actionConfig);
  }

  function selectWorkflow(selector, selectedWorkflow) {
    setWorkflow(selectedWorkflow);
  }

  function applyWorkflow(granuleId) {
    const metaObject = JSON.parse(workflowMeta).meta;
    setWorkflowMeta(defaultWorkflowMeta);
    return applyWorkflowToGranule(granuleId, workflow, metaObject);
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

  return (
    <div className="page__component">
      <Helmet>
        <title> Collection Granules </title>
      </Helmet>
      <CollectionHeader
        breadcrumbConfig={breadcrumbConfig}
        name={collectionName}
        queriedAt={meta.queriedAt}
        version={collectionVersion}
      />
      <section className="page__section">
        <div className="heading__wrapper--border">
          <h2 className="heading--medium heading--shared-content with-description">
            {`${displayCase(view)} ${displayName} `}
            <span className="num-title">
              {`${(meta.count && meta.count) || 0}`}
            </span>
          </h2>
        </div>
        <List
          list={list}
          action={listGranules}
          query={query}
          bulkActions={generateBulkActions()}
          rowId="granuleId"
          sortId="timestamp"
          tableColumns={tableColumns}
          filterAction={filterGranules}
          filterClear={clearGranulesFilter}
        >
          <ListFilters>
            <Search
              action={searchGranules}
              clear={clearGranulesSearch}
              inputProps={{
                className: 'search search--large',
              }}
              label="Search"
              labelKey="granuleId"
              placeholder="Granule ID"
              searchKey="granules"
            />
            {view === 'all' && (
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
            )}
          </ListFilters>
        </List>
      </section>
    </div>
  );
};

CollectionGranules.propTypes = {
  granules: PropTypes.object,
  dispatch: PropTypes.func,
  location: PropTypes.object,
  match: PropTypes.object,
  queryParams: PropTypes.object,
  workflowOptions: PropTypes.array,
};

export default withRouter(
  connect((state) => ({
    granules: state.granules,
    workflowOptions: workflowOptionNames(state),
  }))(CollectionGranules)
);
