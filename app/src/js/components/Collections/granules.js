'use strict';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getCollectionId, lastUpdated, displayCase } from '../../utils/format';
import {
  listGranules,
  filterGranules,
  clearGranulesFilter,
  applyWorkflowToGranule,
  searchGranules,
  clearGranulesSearch
} from '../../actions';
import {
  simpleDropdownOption,
  bulkActions,
  tableColumns
} from '../../utils/table-config/granules';
import List from '../Table/Table';
import Dropdown from '../DropDown/dropdown';
import Search from '../Search/search';
import statusOptions from '../../utils/status';
import {strings} from '../locale';
import { workflowOptionNames } from '../../selectors';
import ListFilters from '../ListActions/ListFilters';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';

const CollectionGranules = ({
  dispatch,
  match,
  location,
  granules,
  workflowOptions
}) => {
  const { params } = match;
  const { name: collectionName, version: collectionVersion } = params;
  const { pathname } = location;
  const { list } = granules;
  const { meta } = list;
  const displayName = strings.granules;
  const collectionId = getCollectionId(params);
  const view = getView();
  const [workflow, setWorkflow] = useState();

  const breadcrumbConfig = [
    {
      label: 'Dashboard Home',
      href: '/'
    },
    {
      label: 'Collections',
      href: '/collections'
    },
    {
      label: 'Collection Overview',
      href: `/collections/collection/${collectionName}/${collectionVersion}`
    },
    {
      label: 'Collection Granules',
      href: `/collections/collection/${collectionName}/${collectionVersion}/granules`,
      active: view === 'all'
    }
  ];

  if (view !== 'all') {
    breadcrumbConfig.push({
      label: displayCase(view),
      active: true
    });
  }

  function generateQuery () {
    const options = { collectionId };
    if (view && view !== 'all') options.status = view;
    return options;
  }

  function getView () {
    if (pathname.includes('/granules/completed')) return 'completed';
    if (pathname.includes('/granules/processing')) return 'running';
    if (pathname.includes('/granules/failed')) return 'failed';
    return 'all';
  }

  function generateBulkActions () {
    const actionConfig = {
      execute: {
        options: getExecuteOptions(),
        action: applyWorkflow
      }
    };

    return bulkActions(granules, actionConfig);
  }

  function selectWorkflow (selector, workflow) {
    setWorkflow(workflow);
  }

  function applyWorkflow (granuleId) {
    return applyWorkflowToGranule(granuleId, workflow);
  }

  function getExecuteOptions () {
    return [
      simpleDropdownOption({
        handler: selectWorkflow,
        label: 'workflow',
        value: workflow,
        options: workflowOptions
      })
    ];
  }

  return (
    <div className="page__component">
      <section className='page__section page__section__controls'>
        <Breadcrumbs config={breadcrumbConfig} />
      </section>
      <section className="page__section page__section__header-wrapper">
        <h1 className="heading--large heading--shared-content with-description ">
          {collectionName} / {collectionVersion}
        </h1>
        <Link
          className="button button--edit button--small form-group__element--right button--green"
          to={`/collections/edit/${collectionName}/${collectionVersion}`}
        >
          Edit
        </Link>
        <dl className="metadata__updated">
          <dd>{lastUpdated(meta.queriedAt)}</dd>
        </dl>
      </section>

      <section className="page__section">
        <div className="heading__wrapper--border">
          <h2 className="heading--medium heading--shared-content with-description">
            {`${displayCase(view)} ${displayName} `}
            <span className="num--title">
              {`${meta.count && meta.count || 0}`}
            </span>
          </h2>
        </div>
        <List
          list={list}
          action={listGranules}
          query={generateQuery()}
          bulkActions={generateBulkActions()}
          rowId='granuleId'
          sortIdx='timestamp'
          tableColumns={tableColumns}
        >
          <ListFilters>
            <Search
              dispatch={dispatch}
              action={searchGranules}
              clear={clearGranulesSearch}
              placeholder='Search Granules'
            />
            {view === 'all' && (
              <Dropdown
                options={statusOptions}
                action={filterGranules}
                clear={clearGranulesFilter}
                paramKey='status'
                inputProps={{
                  placeholder: 'Status'
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
  config: PropTypes.object,
  workflowOptions: PropTypes.array,
  params: PropTypes.object,
  match: PropTypes.object
};

export default withRouter(connect(state => ({
  workflowOptions: workflowOptionNames(state),
  granules: state.granules,
  config: state.config
}))(CollectionGranules));
