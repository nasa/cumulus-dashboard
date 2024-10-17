import React, { useState, useEffect, lazy, Suspense, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
// import withQueryParams from 'react-router-query-params';
import isNil from 'lodash/isNil';
import isEqual from 'lodash/isEqual';
import omitBy from 'lodash/omitBy';
import noop from 'lodash/noop';
import ErrorReport from '../Errors/report';
import Loading from '../LoadingIndicator/loading-indicator';
import Pagination from '../Pagination/pagination';
// Lodash
import ListActions from '../ListActions/ListActions';
import TableHeader from '../TableHeader/table-header';
import ListFilters from '../ListActions/ListFilters';
import TableFilters from './TableFilters';

import { withUrlHelper } from '../../withUrlHelper';

const SortableTable = lazy(() => import('../SortableTable/SortableTable'));

function buildSortKey(sortProps) {
  return sortProps
    .filter((item) => item.id)
    .map((item) => (item.desc === true ? `-${item.id}` : `+${item.id}`));
}

const List = ({
  action,
  bulkActions,
  children,
  data,
  filterAction,
  filterClear,
  groupAction,
  hideActions = false,
  initialHiddenColumns = [],
  initialSortId,
  legend,
  list = {},
  onSelect,
  query = {},
  // queryParams,
  renderRowSubComponent,
  rowId,
  tableColumns,
  tableId,
  toggleColumnOptionsAction,
  useSimplePagination = false,
  urlHelper,
}) => {
  const dispatch = useDispatch();
  const sorts = useSelector((state) => state.sorts);
  const {
    data: listData,
    error: listError,
    inflight: listInflight,
    meta,
  } = list;
  const { count, limit } = meta || {};
  const tableData = data || listData || [];

  const [selected, setSelected] = useState([]);
  const [clearSelected, setClearSelected] = useState(false);
  const [page, setPage] = useState(1);
  const sortBy = tableId ? sorts[tableId] : null;
  const [bulkActionMeta, setBulkActionMeta] = useState({
    completedBulkActions: 0,
    bulkActionError: null,
  });
  // const [params, setParams] = useState({});
  const [toggleColumnOptions, setToggleColumnOptions] = useState({
    hiddenColumns: initialHiddenColumns,
    setHiddenColumns: noop,
  });
  // const searchParams = new URLSearchParams(location.search); // Using location to query params for search
  // const initialInfix = useRef(queryParams.search);

  const queryFilters = omitBy(query, isNil);

  const [queryConfig, setQueryConfig] = useState({
    page: 1,
    sort_key: buildSortKey(sortBy || [{ id: initialSortId, desc: true }]),
    ...query,
  });

  const getQueryConfig = useCallback(() => ({
    ...queryConfig,
    ...queryFilters,
    page,
    sort_key: sortBy ? buildSortKey(sortBy) : queryConfig.sort_key,
  }), [queryConfig, queryFilters, sortBy, page]);

  useEffect(() => {
    setQueryConfig((prevConfig) => ({
      ...prevConfig,
      ...query,
    }));
  }, [query]);

  useEffect(() => {
    if (typeof toggleColumnOptionsAction === 'function') { // replaces noop with modern JS
      const allColumns = tableColumns.map(
        (column) => column.id || column.accessor
      );
      dispatch(
        toggleColumnOptionsAction(initialHiddenColumns, allColumns)
      );
    }
  }, [dispatch, toggleColumnOptionsAction, initialHiddenColumns, tableColumns]);
  /*  const [queryConfig, setQueryConfig] = useState({
    page: 1,
    sort_key: buildSortKey(sortBy || [{ id: initialSortId, desc: true }]),
    ...initialInfix.current ? { infix: initialInfix.current } : {},
    ...query,
  });

  const {
    limit: limitQueryParam,
    page: pageQueryParam,
    search: searchQueryParam,
    ...queryFilters
  } = queryParams;

  useEffect(() => {
    setQueryConfig((prevQueryConfig) => ({
      ...prevQueryConfig,
      ...getQueryConfig({}),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(query)]);

  useEffect(() => {
    // Remove parameters with null or undefined values
    const newParams = omitBy(list.params, isNil);

    if (!isEqual(newParams, params)) {
      setParams(newParams);
      setQueryConfig((prevQueryConfig) => ({
        ...prevQueryConfig,
        ...getQueryConfig({}),
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(list.params), JSON.stringify(params)]);

  useEffect(() => {
    setClearSelected(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(queryFilters)]);

  useEffect(() => {
    if (typeof toggleColumnOptionsAction === 'function') {
      const allColumns = tableColumns.map(
        (column) => column.id || column.accessor
      );
      dispatch(
        toggleColumnOptionsAction(toggleColumnOptions.hiddenColumns, allColumns)
      );
    }
  }, [
    dispatch,
    tableColumns,
    toggleColumnOptions.hiddenColumns,
    toggleColumnOptionsAction,
  ]); */

  function queryNewPage(newPage) {
    setPage(newPage);

    // Update URL with new page number
    if (urlHelper && urlHelper.historyPushWithQueryParams) {
      const currentPath = urlHelper.location.pathname;
      const currentSearch = new URLSearchParams(urlHelper.location.search);
      currentSearch.set('page', newPage.toString());
      urlHelper.historyPushWithQueryParams(`${currentPath}?${currentSearch.toString()}`);
    }

    // Dispatch action to fetch new page data
    const newQueryConfig = getQueryConfig();
    newQueryConfig.page = newPage;
    dispatch(action(newQueryConfig));
  }

  function queryNewSort(sortProps) {
    const newQueryConfig = getQueryConfig({
      sort_key: buildSortKey(sortProps),
    });
    if (!isEqual(queryConfig, newQueryConfig)) {
      setQueryConfig(newQueryConfig);
    }
  }

  function updateSelection(selectedIds, currentSelectedRows) {
    if (!isEqual(selected, selectedIds)) {
      setSelected(selectedIds);
      setClearSelected(false);
      // Current selection is passed to the parent component
      if (typeof onSelect === 'function') {
        onSelect(selectedIds, currentSelectedRows);
      }
    }
  }

  const hasActions = Array.isArray(bulkActions) && bulkActions.length > 0;

  const { completedBulkActions } = bulkActionMeta;

  function onBulkActionSuccess(results) {
    setBulkActionMeta((prevState) => ({
      ...prevState,
      completedBulkActions: prevState.completedBulkActions + 1,
      bulkActionsError: null,
    }));
    setClearSelected(true);
  }
  /*   function onBulkActionSuccess(results, error) {
    // not-elegant way to trigger a re-fresh in the timer
    setBulkActionMeta((prevBulkActionMeta) => {
      const {
        completedBulkActions: prevCompletedBulkActions,
        bulkActionError: prevBulkActionError,
      } = prevBulkActionMeta;
      return {
        completedBulkActions: prevCompletedBulkActions + 1,
        bulkActionError: error ? prevBulkActionError : null,
      };
    });
    setClearSelected(true);
  } */

  function onBulkActionError(error) {
    const newBulkActionError =
      error.id && error.error
        ? `Could not process ${error.id}, ${error.error}`
        : error;

    setBulkActionMeta((prevState) => ({
      ...prevState,
      bulkActionError: newBulkActionError,
    }));
    setClearSelected(true);

  /*    setBulkActionMeta((prevBulkActionMeta) => ({
      ...prevBulkActionMeta,
      bulkActionError: newBulkActionError,
    }));
    setClearSelected(true); */
  }

  /*   function getQueryConfig(config = {}) {
    // Remove empty keys so as not to mess up the query
    return omitBy(
      {
        page,
        sort_key: queryConfig.sort_key,
        ...params,
        ...config,
        ...query,
      },
      isNil
    );
  } */

  const getToggleColumnOptions = useCallback((newOptions) => {
    setToggleColumnOptions(newOptions);
  }, []);

  return (
    <>
      {!hideActions && <ListActions
        dispatch={dispatch}
        action={action}
        bulkActions={bulkActions}
        groupAction={groupAction}
        queryConfig={queryConfig}
        completedBulkActions={completedBulkActions}
        onBulkActionSuccess={onBulkActionSuccess}
        onBulkActionError={onBulkActionError}
        selected={selected}
      >
        {children}
        <ListFilters>
          <TableFilters
            columns={tableColumns}
            {...toggleColumnOptions}
            initialHiddenColumns={initialHiddenColumns}
          />
          {legend}
        </ListFilters>
      </ListActions>}
      <div className="list-view">
        {listInflight && <Loading />}
        {listError && <ErrorReport report={listError} truncate={true} />}
        {bulkActionMeta.bulkActionError && <ErrorReport report={bulkActionMeta.bulkActionError} />}
        <div className="list__wrapper">
          {filterAction && (
            <TableHeader
              action={filterAction}
              clear={filterClear}
              count={count}
              limit={limit}
              onNewPage={queryNewPage}
              page={page}
              selected={selected}
            />
          )}
          <Suspense fallback={<Loading />}>
            <SortableTable
              tableColumns={tableColumns}
              data={tableData}
              canSelect={hasActions}
              rowId={rowId}
              onSelect={updateSelection}
              changeSortProps={queryNewSort}
              clearSelected={clearSelected}
              initialHiddenColumns={initialHiddenColumns}
              initialSortId={initialSortId}
              // if there's an initialSortId, it means the first fetch request for the list should be sorted
              // according to that id, and therefore we are using sever-side/manual sorting
              shouldManualSort={!!initialSortId}
              getToggleColumnOptions={getToggleColumnOptions}
              renderRowSubComponent={renderRowSubComponent}
              tableId={tableId}
              initialSortBy={sortBy}
              shouldUsePagination={useSimplePagination}
            />
          </Suspense>
          {!useSimplePagination && <Pagination
            count={count}
            limit={limit}
            page={page}
            onNewPage={queryNewPage}
            showPages={true}
          />}
        </div>
      </div>
    </>
  );
};

List.propTypes = {
  action: PropTypes.func,
  bulkActions: PropTypes.array,
  children: PropTypes.node,
  data: PropTypes.array,
  dispatch: PropTypes.func,
  filterAction: PropTypes.func,
  filterClear: PropTypes.func,
  groupAction: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
  }),
  hideActions: PropTypes.bool,
  initialHiddenColumns: PropTypes.array,
  initialSortId: PropTypes.string,
  legend: PropTypes.node,
  list: PropTypes.object,
  query: PropTypes.object,
  rowId: PropTypes.any,
  toggleColumnOptionsAction: PropTypes.func,
  tableColumns: PropTypes.array,
  onSelect: PropTypes.func,
  // queryParams: PropTypes.object,
  renderRowSubComponent: PropTypes.func,
  tableId: PropTypes.string,
  sorts: PropTypes.object,
  useSimplePagination: PropTypes.bool,
  urlHelper: PropTypes.shape({
    location: PropTypes.object,
    historyPushWithQueryParams: PropTypes.func,
  }),
};

export { List };

export default withUrlHelper(List);
