import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isNil from 'lodash/isNil';
import isEqual from 'lodash/isEqual';
import omitBy from 'lodash/omitBy';
import ErrorReport from '../Errors/report';
import Loading from '../LoadingIndicator/loading-indicator';
import Pagination from '../Pagination/pagination';
import SortableTable from '../SortableTable/SortableTable';
// Lodash
import ListActions from '../ListActions/ListActions';
import TableHeader from '../TableHeader/table-header';

function buildSortKey(sortProps) {
  return sortProps.filter((item) => item.id).map((item) => (item.desc === true ? `-${item.id}` : `+${item.id}`));
}

class List extends React.Component {
  constructor(props) {
    super(props);
    this.queryNewPage = this.queryNewPage.bind(this);
    this.queryNewSort = this.queryNewSort.bind(this);
    this.updateSelection = this.updateSelection.bind(this);
    this.onBulkActionSuccess = this.onBulkActionSuccess.bind(this);
    this.onBulkActionError = this.onBulkActionError.bind(this);
    this.getQueryConfig = this.getQueryConfig.bind(this);

    const initialPage = 1;
    const initialSortId = props.sortId;
    const initialOrder = 'desc';
    const sortProps = initialSortId ? [{ id: initialSortId, desc: true }] : [];

    this.state = {
      page: initialPage,
      sortId: initialSortId,
      order: initialOrder,
      sortProps,
      selected: [],
      clearSelected: false,
      infix: null,
      queryConfig: {
        page: initialPage,
        sort_key: buildSortKey(sortProps),
        ...(props.query || {}),
      },
      params: {},
      completedBulkActions: 0,
      bulkActionError: null,
    };
  }

  componentDidUpdate(prevProps) {
    const { query, list } = this.props;

    if (!isEqual(query, prevProps.query)) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ queryConfig: this.getQueryConfig({}, query) });
    }

    // Remove parameters with null or undefined values
    const params = omitBy(list.params, isNil);

    if (!isEqual(params, this.state.params)) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ params }, () => this.setState({
        queryConfig: this.getQueryConfig(),
      }));
    }
  }

  queryNewPage(page) {
    this.setState({
      page,
      queryConfig: this.getQueryConfig({ page }),
      clearSelected: true,
    });
  }

  queryNewSort(sortProps) {
    this.setState({
      sortProps,
      queryConfig: this.getQueryConfig({
        sort_key: buildSortKey(sortProps),
      }),
      clearSelected: true,
    });
  }

  updateSelection(selected) {
    this.setState({
      selected,
      clearSelected: false,
    });
  }

  onBulkActionSuccess(results, error) {
    // not-elegant way to trigger a re-fresh in the timer
    this.setState({
      completedBulkActions: this.state.completedBulkActions + 1,
      clearSelected: true,
      bulkActionError: error ? this.state.bulkActionError : null,
    });
  }

  onBulkActionError(error) {
    const bulkActionError =
      error.id && error.error
        ? `Could not process ${error.id}, ${error.error}`
        : error;

    this.setState({
      bulkActionError,
      clearSelected: true,
    });
  }

  getQueryConfig(config = {}, query = this.props.query || {}) {
    // Remove empty keys so as not to mess up the query
    const { search, ...restQuery } = query;
    return omitBy(
      {
        page: this.state.page,
        sort_key: buildSortKey(this.state.sortProps),
        infix: search,
        ...this.state.params,
        ...config,
        ...restQuery,
      },
      isNil
    );
  }

  render() {
    const {
      dispatch,
      action,
      children,
      bulkActions,
      rowId,
      sortId: initialSortId,
      list,
      tableColumns,
      data,
      filterAction,
      filterClear,
    } = this.props;
    const { meta, data: listData } = list;
    const { count, limit } = meta;
    const tableData = data || listData;
    const {
      page,
      sortId,
      order,
      selected,
      clearSelected,
      completedBulkActions,
      bulkActionError,
      queryConfig,
    } = this.state;
    const hasActions = Array.isArray(bulkActions) && bulkActions.length > 0;

    return (
      <>
        <ListActions
          dispatch={dispatch}
          action={action}
          bulkActions={bulkActions}
          queryConfig={queryConfig}
          completedBulkActions={completedBulkActions}
          onBulkActionSuccess={this.onBulkActionSuccess}
          onBulkActionError={this.onBulkActionError}
          selected={selected}
        >
          {children}
        </ListActions>
        <div className="list-view">
          {list.inflight && <Loading />}
          {list.error && <ErrorReport report={list.error} truncate={true} />}
          {bulkActionError && <ErrorReport report={bulkActionError} />}
          <div className="list__wrapper">
            {filterAction && (
              <TableHeader
                action={filterAction}
                clear={filterClear}
                count={count}
                limit={limit}
                page={page}
                onNewPage={this.queryNewPage}
              />
            )}
            <SortableTable
              tableColumns={tableColumns}
              data={tableData}
              canSelect={hasActions}
              rowId={rowId}
              onSelect={this.updateSelection}
              initialSortId={initialSortId}
              sortId={sortId}
              changeSortProps={this.queryNewSort}
              order={order}
              clearSelected={clearSelected}
            />
            <Pagination
              count={count}
              limit={limit}
              page={page}
              onNewPage={this.queryNewPage}
              showPages={true}
            />
          </div>
        </div>
      </>
    );
  }
}

List.propTypes = {
  action: PropTypes.func,
  bulkActions: PropTypes.array,
  children: PropTypes.node,
  data: PropTypes.array,
  dispatch: PropTypes.func,
  filterAction: PropTypes.func,
  filterClear: PropTypes.func,
  list: PropTypes.object,
  query: PropTypes.object,
  rowId: PropTypes.any,
  sortId: PropTypes.string,
  tableColumns: PropTypes.array,
};

export { List };
export default connect()(List);
