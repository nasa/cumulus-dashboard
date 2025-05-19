import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { get } from 'object-path';
import isEqual from 'lodash/isEqual';
import {
  searchGranules,
  clearGranulesSearch,
  filterGranules,
  clearGranulesFilter,
  listGranules,
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
import { withUrlHelper } from '../../withUrlHelper';

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

const GranulesOverview = ({ urlHelper }) => {
  const dispatch = useDispatch();
  const { queryParams } = urlHelper;

  const collections = useSelector((state) => state.collections);
  const config = useSelector((state) => state.config);
  const granules = useSelector((state) => state.granules);
  const workflowOptions = useSelector((state) => workflowOptionNames(state));
  const providers = useSelector((state) => state.providers);

  const [selected, setSelected] = useState([]);
  const [workflow, setWorkflow] = useState(workflowOptions[0]);
  const [workflowMeta, setWorkflowMeta] = useState(defaultWorkflowMeta);

  const { list } = granules;
  const { count, queriedAt } = list.meta;
  const { dropdowns } = collections;
  const { dropdowns: providerDropdowns } = providers;
  const query = generateQuery();

  useEffect(() => {
    if (!isEqual(workflowOptions[0], workflowOptions)) {
      setWorkflow(workflowOptions[0]);
    }
  }, [workflowOptions, workflow]);

  function generateQuery() {
    return {
      ...queryParams,
    };
  }

  function generateBulkActions() {
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
  }

  function selectWorkflow(selectedWorkflow) {
    setWorkflow(selectedWorkflow);
  }

  function applyWorkflow(granuleId) {
    const { meta } = JSON.parse(workflowMeta);
    isWorkflowMeta(defaultWorkflowMeta);
    return dispatch(applyWorkflowToGranule(granuleId, workflow, meta));
  }

  function getExecuteOptions() {
    return [
      executeDialog({
        selectHandler: selectWorkflow,
        label: 'workflow',
        value: workflow,
        options: workflowOptions,
        initialMeta: workflowMeta,
        metaHandler: isWorkflowMeta,
      }),
    ];
  }

  function isWorkflowMeta(meta) {
    setWorkflowMeta(meta);
  }

  function applyRecoveryWorkflow(granuleId, workflowName) {
    dispatch(applyRecoveryWorkflowToGranule(granuleId, workflowName));
  }

  function updateSelection(selectedIds) {
    const allSelectedRows = [...selected, ...list.data];
    const updatedSelected = selectedIds
      .map((id) => allSelectedRows.find((g) => id === g.granuleId))
      .filter(Boolean);
    setSelected(updatedSelected);
  }

  // Not sure what this is supposed to work with even in previous code
  /*   const queryMeta = () => {
      dispatch(listWorkflows());
    };
  */

  return (
    <div className='page__component'>
      <Helmet>
        <title> Granules Overview </title>
      </Helmet>
      <section className='page__section page__section__controls'>
        <Breadcrumbs config={breadcrumbConfig} />
      </section>
      <section className='page__section page__section__header-wrapper'>
        <div className='page__section__header'>
          <h1 className='heading--large heading--shared-content with-description '>
            Granule Overview
          </h1>
          {lastUpdated(queriedAt)}
          <Overview type='granules' inflight={granules.list.inflight} />
        </div>
      </section>
      <section className='page__section'>
        <div className='heading__wrapper--border'>
          <h2 className='heading--medium heading--shared-content with-description'>
            {strings.granules}{' '}
            <span className='num-title'>{count ? ` ${tally(count)}` : 0}</span>
          </h2>
        </div>
        <List
          list={list}
          action={listGranules}
          tableColumns={tableColumns}
          query={query}
          bulkActions={generateBulkActions()}
          groupAction={groupAction}
          rowId='granuleId'
          initialHiddenColumns={defaultHiddenColumns}
          initialSortId='updatedAt'
          filterAction={filterGranules}
          filterClear={clearGranulesFilter}
          onSelect={updateSelection}
          toggleColumnOptionsAction={toggleGranulesTableColumns}
          tableId='granules-overview'
        >
          <Search
            action={searchGranules}
            clear={clearGranulesSearch}
            label='Search'
            labelKey='granuleId'
            placeholder='Granule ID'
            searchKey='granules'
          />
          <ListFilters>
            <Dropdown
              options={statusOptions}
              action={filterGranules}
              clear={clearGranulesFilter}
              paramKey='status'
              label='Status'
              inputProps={{
                placeholder: 'All',
              }}
            />
            <Dropdown
              getOptions={getOptionsCollectionName}
              options={get(dropdowns, ['collectionName', 'options'])}
              action={filterGranules}
              clear={clearGranulesFilter}
              paramKey='collectionId'
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
              paramKey='provider'
              label='Provider'
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

GranulesOverview.propTypes = {
  workflowOptions: PropTypes.array,
  urlHelper: PropTypes.shape({
    queryParams: PropTypes.object
  }),
};

export { GranulesOverview };

export default withUrlHelper(GranulesOverview);
