import React from 'react';
import { get } from 'object-path';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  clearExecutionsFilter,
  filterExecutions,
  searchExecutions,
  clearExecutionsSearch,
  getCumulusInstanceMetadata,
  listExecutions,
  listWorkflows,
  getOptionsCollectionName,
} from '../../actions';
import { tally, lastUpdated } from '../../utils/format';
import { workflowOptions as workflowSelectOptions } from '../../selectors';
import statusOptions from '../../utils/status';
import List from '../Table/Table';
import Dropdown from '../DropDown/dropdown';
import Search from '../Search/search';
import Overview from '../Overview/overview';
import { strings } from '../locale';
import { tableColumns } from '../../utils/table-config/executions';
import ListFilters from '../ListActions/ListFilters';

class ExecutionOverview extends React.Component {
  constructor(props) {
    super(props);
    this.queryMeta = this.queryMeta.bind(this);
    this.searchOperationId = this.searchOperationId.bind(this);
  }

  componentDidMount() {
    this.queryMeta();
    this.props.dispatch(getCumulusInstanceMetadata());
  }

  queryMeta() {
    const { dispatch } = this.props;
    dispatch(listWorkflows());
  }

  searchOperationId(list, infix) {
    return list.filter((item) => item.asyncOperationId && item.asyncOperationId.includes(infix));
  }

  render() {
    const {
      collections,
      executions,
      queryParams,
      workflowOptions,
    } = this.props;
    const { dropdowns } = collections;
    const { list } = executions;
    const { count, queriedAt } = list.meta;
    if (list.infix && list.infix.value) {
      list.data = this.searchOperationId(list.data, list.infix.value);
    }
    return (
      <div className="page__component">
        <section className="page__section page__section__header-wrapper">
          <div className="page__section__header">
            <h1 className="heading--large heading--shared-content with-description">
              Execution Overview
            </h1>
            {lastUpdated(queriedAt)}
            <Overview type='executions' inflight={false} />
          </div>
        </section>
        <section className="page__section">
          <div className="heading__wrapper--border">
            <h2 className="heading--medium heading--shared-content with-description">
              All Executions
              <span className="num-title">
                {count ? ` ${tally(count)}` : 0}
              </span>
            </h2>
          </div>
          <List
            list={list}
            action={listExecutions}
            tableColumns={tableColumns}
            query={{ ...queryParams }}
            rowId='name'
            initialSortId='createdAt'
            filterAction={filterExecutions}
            filterClear={clearExecutionsFilter}
          >
            <Search
              action={searchExecutions}
              clear={clearExecutionsSearch}
              paramKey="asyncOperationId"
              label="Async Operation ID"
              labelKey="asyncOperationId"
              placeholder="Search"
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
                paramKey={'collectionId'}
                label={strings.collection_id}
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
  }
}

ExecutionOverview.propTypes = {
  collections: PropTypes.object,
  dispatch: PropTypes.func,
  executions: PropTypes.object,
  queryParams: PropTypes.object,
  workflowOptions: PropTypes.array,
};

export default withRouter(connect((state) => ({
  collections: state.collections,
  executions: state.executions,
  workflowOptions: workflowSelectOptions(state),
}))(ExecutionOverview));
