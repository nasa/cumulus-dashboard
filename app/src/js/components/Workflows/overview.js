import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { tally } from '../../utils/format';
import {
  listWorkflows,
  searchWorkflows,
  clearWorkflowsSearch,
} from '../../actions';
import List from '../Table/Table';
import ListFilters from '../ListActions/ListFilters';
import Search from '../Search/search';
import { tableColumns } from '../../utils/table-config/workflows';

const WorkflowOverview = ({ dispatch, queryParams, workflows }) => {
  const { list, searchString } = workflows;
  const count = list.data.length;

  useEffect(() => {
    dispatch(listWorkflows());
    // when searchString changes, we want a fresh workflow fetch
  }, [dispatch, searchString]);

  return (
    <div className="page__component">
      <section className="page__section page__section__header-wrapper">
        <h1 className="heading--large heading--shared-content with-description">
          Workflow Overview
        </h1>
      </section>
      <section className="page__section">
        <div className="heading__wrapper--border">
          <h2 className="heading--medium heading--shared-content with-description">
            All Workflows
            <span className="num-title">{count ? ` ${tally(count)}` : 0}</span>
          </h2>
        </div>
        <List
          list={list}
          action={listWorkflows}
          tableColumns={tableColumns}
          query={{ ...queryParams }}
          initialSortId="name"
          rowId="name"
          tableId="workflows"
        >
          <Search
            action={searchWorkflows}
            clear={clearWorkflowsSearch}
            label="Search"
            labelKey="name"
            placeholder="Workflow Name"
            searchKey="workflows"
          />
          <ListFilters>
            {/* Someone needs to define the search parameters for workflows,
            e.g. steps, collections, granules, etc. } */}
          </ListFilters>
        </List>
      </section>
    </div>
  );
};

WorkflowOverview.propTypes = {
  dispatch: PropTypes.func,
  queryParams: PropTypes.object,
  workflows: PropTypes.object,
};

export default withRouter(
  connect((state) => ({ workflows: state.workflows }))(WorkflowOverview)
);
