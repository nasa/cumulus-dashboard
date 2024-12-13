import React, { useState, useEffect, useMemo, lazy, Suspense, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
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
  const sortBy = tableId ? sorts[tableId] : null;
  const initialInfix = useRef(null);
  const { historyPushWithQueryParams, location, queryParams } = urlHelper;

  // Extract query filters from query params
  const queryFilters = useMemo(() => {
    const {
      limit: limitQueryParam,
      page: pageQueryParam,
      search: searchQueryParam,
      ...filters
    } = queryParams;
    return filters;
  }, [queryParams]);

  const {
    data: listData,
    error: listError,
    inflight: listInflight,
    meta,
  } = list;
  const { count, limit } = meta || {};

  // Memoize data
  const tableData = useMemo(() => data || listData || [], [data, listData]);

  // State management
  const [selected, setSelected] = useState([]);
  const [clearSelected, setClearSelected] = useState(false);
  const [page, setPage] = useState(1);
  const [bulkActionMeta, setBulkActionMeta] = useState({
    completedBulkActions: 0,
    bulkActionError: null,
  });
  const [params, setParams] = useState({});
  const [toggleColumnOptions, setToggleColumnOptions] = useState({
    hiddenColumns: initialHiddenColumns,
    setHiddenColumns: noop,
  });

  // Initialize queryConfig with sortBy from Redux
  const [queryConfig, setQueryConfig] = useState({
    page: 1,
    sort_key: buildSortKey(sortBy || [{ id: initialSortId, desc: true }]),
    ...initialInfix.current ? { infix: initialInfix.current } : {},
    ...query,
  });

  // Memoized values
  const memoizedQuery = useMemo(() => query, [query]);

  const memoizedQueryFilters = useMemo(() => omitBy(queryFilters, isNil), [queryFilters]);

  // Get query configuration: Remove empty keys so as not to mess up the query
  const getQueryConfig = useCallback((config = {}) => omitBy({
    ...queryConfig,
    ...queryFilters,
    page,
    sort_key: sortBy ? buildSortKey(sortBy) : queryConfig.sort_key,
    ...config
  }, isNil), [queryConfig, queryFilters, sortBy, page]);

  // Memoize getQueryConfig result to prevent infinite loops
  const currentQueryConfig = useMemo(
    () => getQueryConfig({}),
    [getQueryConfig]
  );

  // Effect for query changes
  useEffect(() => {
    const newQueryConfig = currentQueryConfig;
    if (!isEqual(newQueryConfig, queryConfig)) {
      setQueryConfig(newQueryConfig);
    }
  }, [currentQueryConfig, queryConfig]);

  // Effect for params changes
  useEffect(() => {
    const newParams = omitBy({
      ...params,
      ...queryFilters,
    }, isNil);

    if (!isEqual(newParams, params)) {
      setParams(newParams);
      // Don't update queryConfig here as it will cause a loop
    }
  }, [queryFilters, params]);

  // useEffects for query management
  useEffect(() => {
    setQueryConfig((prevQueryConfig) => ({
      ...prevQueryConfig,
      ...getQueryConfig({}),
    }));
  }, [memoizedQuery, getQueryConfig]);

  useEffect(() => {
    // Remove parameters with null or undefined values
    const newParams = {
      ...params,
      ...memoizedQueryFilters,
    };
    if (!isEqual(newParams, params)) {
      setParams(newParams);
      setQueryConfig((prevQueryConfig) => ({
        ...prevQueryConfig,
        ...getQueryConfig({}),
      }));
    }
  }, [params, memoizedQueryFilters, getQueryConfig]);

  useEffect(() => {
    setClearSelected(true);
  }, [memoizedQueryFilters]);

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

  // Update page handling
  const queryNewPage = useCallback((newPage) => {
    setPage(newPage);

    // Update URL with new page number
    if (historyPushWithQueryParams) {
      const currentPath = location.pathname;
      const currentSearch = new URLSearchParams(location.search);
      currentSearch.set('page', newPage.toString());
      historyPushWithQueryParams(`${currentPath}?${currentSearch.toString()}`);
    }

    // Dispatch action to fetch new page data
    const newQueryConfig = getQueryConfig();
    newQueryConfig.page = newPage;
    dispatch(action(newQueryConfig));
  }, [getQueryConfig, historyPushWithQueryParams, location, dispatch, action]);

  useEffect(() => {
    if (queryConfig.page !== page) {
      setQueryConfig((prev) => ({
        ...prev,
        page
      }));
    }
  }, [page, queryConfig.page]);

  // Update sort handling
  const queryNewSort = useCallback((sortProps) => {
    const newQueryConfig = getQueryConfig({
      sort_key: buildSortKey(sortProps),
    });
    if (!isEqual(queryConfig, newQueryConfig)) {
      setQueryConfig(newQueryConfig);
      dispatch(action(newQueryConfig));
    }
  }, [getQueryConfig, queryConfig, dispatch, action]);

  // Update selection handling if needed
  const updateSelection = useCallback((selectedIds, currentSelectedRows) => {
    if (!isEqual(selected, selectedIds)) {
      setSelected(selectedIds);
      setClearSelected(false);
      // Current selection is passed to the parent component
      if (typeof onSelect === 'function') {
        onSelect(selectedIds, currentSelectedRows);
      }
    }
  }, [selected, onSelect]);

  // Debug logging
  /*   useEffect(() => {
    console.log('Table render:', {
      queryConfig,
      page,
      tableData,
      meta
    });
  }, [queryConfig, page, tableData, meta]);
 */
  // Bulk Actions
  const hasActions = useMemo(
    () => Array.isArray(bulkActions) && bulkActions.length > 0,
    [bulkActions]
  );

  const { completedBulkActions } = bulkActionMeta;

  const onBulkActionSuccess = useCallback((results) => {
    setBulkActionMeta((prevState) => ({
      ...prevState,
      completedBulkActions: prevState.completedBulkActions + 1,
      bulkActionsError: null,
    }));
    setClearSelected(true);
  }, []);

  const onBulkActionError = useCallback((error) => {
    const newBulkActionError =
      error.id && error.error
        ? `Could not process ${error.id}, ${error.error}`
        : error;

    setBulkActionMeta((prevState) => ({
      ...prevState,
      bulkActionError: newBulkActionError,
    }));
    setClearSelected(true);
  }, []);

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
              // according to that id, and therefore we are using server-side/manual sorting
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
  renderRowSubComponent: PropTypes.func,
  tableId: PropTypes.string,
  sorts: PropTypes.object,
  useSimplePagination: PropTypes.bool,
  urlHelper: PropTypes.shape({
    location: PropTypes.object,
    historyPushWithQueryParams: PropTypes.func,
    queryParams: PropTypes.object,
  }),
};

export { List };

export default withUrlHelper(List);
