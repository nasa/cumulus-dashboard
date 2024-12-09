import React, { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { get } from 'object-path';
import PropTypes from 'prop-types';
import {
  clearExecutionsFilter,
  filterExecutions,
  searchExecutions,
  clearExecutionsSearch,
  listExecutions,
  listWorkflows,
  getOptionsCollectionName,
} from '../../actions';
import { workflowOptions as workflowSelectOptions } from '../../selectors';
import { tally, lastUpdated } from '../../utils/format';
import statusOptions from '../../utils/status';
import { tableColumns } from '../../utils/table-config/executions';
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
    label: 'Executions Overview',
    href: '/executions',
    active: true,
  },
];

const ExecutionOverview = ({
  collections,
  executions,
  workflowOptions,
  urlHelper
}) => {
  const dispatch = useDispatch();
  const { queryParams } = urlHelper;
  const { dropdowns } = collections;
  const { list } = executions;
  const { inflight, meta } = list;
  const { count, queriedAt } = meta;
  const tableColumnsArray = tableColumns({ dispatch });

  useEffect(() => {
    dispatch(listWorkflows());
  }, [dispatch]);

  return (
    <div className="page__component">
      <section className="page__section page__section__controls">
        <Breadcrumbs config={breadcrumbConfig} />
      </section>
      <section className="page__section page__section__header-wrapper">
        <div className="page__section__header">
          <h1 className="heading--large heading--shared-content with-description">
            Executions Overview
          </h1>
          {lastUpdated(queriedAt)}
          <Overview type="executions" inflight={inflight} />
        </div>
      </section>
      <section className="page__section">
        <div className="heading__wrapper--border">
          <h2 className="heading--medium heading--shared-content with-description">
            All Executions
            <span className="num-title">{count ? ` ${tally(count)}` : 0}</span>
          </h2>
        </div>
        <List
          list={list}
          action={listExecutions}
          tableColumns={tableColumnsArray}
          query={{ ...queryParams }}
          rowId="name"
          initialSortId="updatedAt"
          filterAction={filterExecutions}
          filterClear={clearExecutionsFilter}
          tableId="executions"
        >
          <Search
            action={searchExecutions}
            clear={clearExecutionsSearch}
            label="Search"
            labelKey="name"
            placeholder="Execution Name"
            searchKey="executions"
          />
          <ListFilters>
            <Dropdown
              options={statusOptions}
              action={filterExecutions}
              clear={clearExecutionsFilter}
              paramKey={'status'}
              label={'Status'}
              inputProps={{
                placeholder: 'All',
              }}
            />
            <Dropdown
              options={workflowOptions}
              action={filterExecutions}
              clear={clearExecutionsFilter}
              paramKey={'type'}
              label={'Workflow'}
              inputProps={{
                placeholder: 'All',
                className: 'dropdown--medium',
              }}
            />
            <Dropdown
              getOptions={getOptionsCollectionName}
              options={get(dropdowns, ['collectionName', 'options']) || []}
              action={filterExecutions}
              clear={clearExecutionsFilter}
              paramKey="collectionId"
              label="Collection ID"
              inputProps={{
                placeholder: 'All',
                className: 'dropdown--large',
              }}
            />
          </ListFilters>
        </List>
      </section>
    </div>
  );
};

ExecutionOverview.propTypes = {
  collections: PropTypes.object,
  dispatch: PropTypes.func,
  executions: PropTypes.object,
  workflowOptions: PropTypes.array,
  urlHelper: PropTypes.shape({
    queryParams: PropTypes.object
  }),
};

const mapStatetoProps = (state) => ({
  collections: state.collections,
  executions: state.executions,
  workflowOptions: workflowSelectOptions(state),
});

export default connect(mapStatetoProps)(withUrlHelper(ExecutionOverview));
