import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import cloneDeep from 'lodash/cloneDeep';
import {
  clearOperationsFilter,
  filterOperations,
  searchOperations,
  clearOperationsSearch,
  getCount,
  getCumulusInstanceMetadata,
  listCollections,
  listOperations,
  listWorkflows,
  refreshCumulusDbConnection,
} from '../../actions';
import { tally } from '../../utils/format';
import List from '../Table/Table';
import Dropdown from '../DropDown/dropdown';
import Search from '../Search/search';
import { tableColumns } from '../../utils/table-config/operations';
import ListFilters from '../ListActions/ListFilters';
import { operationStatus } from '../../utils/status';
import { operationTypes } from '../../utils/type';

class OperationOverview extends React.Component {
  constructor(props) {
    super(props);
    this.queryMeta = this.queryMeta.bind(this);
    this.generateQuery = this.generateQuery.bind(this);
    this.searchOperations = this.searchOperations.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(refreshCumulusDbConnection());
    this.queryMeta();
    this.props.dispatch(getCumulusInstanceMetadata());
  }

  generateQuery() {
    return { ...this.props.queryParams };
  }

  queryMeta() {
    const { dispatch, queryParams } = this.props;
    dispatch(
      listCollections({
        limit: 100,
        fields: 'name,version',
      })
    );
    dispatch(listWorkflows());
    dispatch(
      getCount({
        type: 'executions',
        field: 'status',
        ...queryParams,
      })
    );
  }

  searchOperations(list, infix) {
    return list.filter((item) => item.id.includes(infix));
  }

  render() {
    const { operations } = this.props;
    const { list } = operations;
    const { count } = list.meta;
    const mutableList = cloneDeep(list);
    //  This data munging should probably be handled in the reducer, but this is a workaround.
    if (mutableList.internal.infix) {
      if (mutableList.internal.infix.queryValue) {
        mutableList.data = this.searchOperations(
          mutableList.data,
          mutableList.internal.infix.queryValue
        );
      } else if (typeof mutableList.internal.infix === 'string') {
        mutableList.data = this.searchOperations(
          mutableList.data,
          mutableList.internal.infix
        );
      }
    }

    return (
      <div className="page__component">
        <Helmet>
          <title> Operations Overview </title>
        </Helmet>
        <section className="page__section page__section__header-wrapper">
          <div className="page__section__header">
            <h1 className="heading--large heading--shared-content with-description">
              Operations Overview
            </h1>
          </div>
        </section>
        <section className="page__section">
          <div className="heading__wrapper--border">
            <h2 className="heading--medium heading--shared-content with-description">
              All Operations <span className="num-title">{tally(count)}</span>
            </h2>
          </div>
          <List
            list={mutableList}
            action={listOperations}
            tableColumns={tableColumns}
            query={this.generateQuery()}
            rowId="id"
            initialSortId="createdAt"
            filterAction={filterOperations}
            filterClear={clearOperationsFilter}
            tableId="operations"
          >
            <Search
              action={searchOperations}
              clear={clearOperationsSearch}
              label="Search"
              labelKey="id"
              searchKey="operations"
              placeholder="Async Operation ID"
            />
            <ListFilters>
              <Dropdown
                options={operationStatus}
                action={filterOperations}
                clear={clearOperationsFilter}
                paramKey={'status'}
                label={'Status'}
                inputProps={{
                  placeholder: 'All',
                  className: 'dropdown--small',
                }}
              />
              <Dropdown
                options={operationTypes}
                action={filterOperations}
                clear={clearOperationsFilter}
                paramKey={'operationType'}
                label={'Type'}
                inputProps={{
                  placeholder: 'All',
                  className: 'dropdown--small',
                }}
              />
            </ListFilters>
          </List>
        </section>
      </div>
    );
  }
}

OperationOverview.propTypes = {
  dispatch: PropTypes.func,
  operations: PropTypes.object,
  queryParams: PropTypes.object,
};

export default withRouter(
  connect((state) => ({
    operations: state.operations,
  }))(OperationOverview)
);
