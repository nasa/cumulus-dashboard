import React, {
  useMemo,
  useEffect,
  forwardRef,
  useRef,
  useState,
  createRef
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import omit from 'lodash/omit';
import { useTable, useResizeColumns, useFlexLayout, useSortBy, useRowSelect, usePagination, useExpanded } from 'react-table';
import { useDispatch } from 'react-redux';
import TableHeader from '../TableHeader/table-header';
import SimplePagination from '../Pagination/simple-pagination';
import TableFilters from '../Table/TableFilters';
import ListFilters from '../ListActions/ListFilters';
import { sortPersist } from '../../actions/index';

const getColumnWidth = (rows, accessor, headerText, originalWidth) => {
  const maxWidth = 400;
  const magicSpacing = 10;
  const cellLength = Math.max(
    ...rows.map((row) => (`${row.values[accessor]}` || '').length * magicSpacing),
    headerText.length * magicSpacing,
    originalWidth,
  );
  return Math.min(maxWidth, cellLength);
};

/**
 * IndeterminateCheckbox
 * @description Component for rendering the header and column checkboxes when canSelect is true
 * Taken from react-table examples
 */
const IndeterminateCheckbox = forwardRef(
  ({ indeterminate, title, ...rest }, ref) => {
    const defaultRef = useRef();
    const resolvedRef = ref || defaultRef;

    useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <input type="checkbox" ref={resolvedRef} aria-label={title} title={title} {...rest} />
    );
  }
);

IndeterminateCheckbox.propTypes = {
  indeterminate: PropTypes.any,
  onChange: PropTypes.func,
  title: PropTypes.string,
};

const SortableTable = ({
  canSelect,
  changeSortProps,
  className = '',
  clearSelected,
  data = [],
  getToggleColumnOptions,
  hideFilters = false,
  initialHiddenColumns = [],
  initialSortId,
  legend,
  onSelect,
  rowId,
  shouldManualSort = false,
  shouldUsePagination = false,
  tableColumns = [],
  renderRowSubComponent,
  tableId,
  initialSortBy = [],
}) => {
  const defaultColumn = useMemo(
    () => ({
      Cell: ({ value = '' }) => value,
      // When using the useFlexLayout:
      minWidth: 50, // minWidth is only used as a limit for resizing
      width: 125, // width is used for both the flex-basis and flex-grow
    }),
    []
  );
  const [fitColumn, setFitColumn] = useState({});
  const [leftScrollButtonVisibility, setLeftScrollButtonVisibility] = useState({ display: 'none', opacity: 0 });
  const [rightScrollButtonVisibility, setRightScrollButtonVisibility] = useState({ display: 'none', opacity: 0 });
  let sortByState;
  if (initialSortBy?.length > 0) {
    sortByState = initialSortBy;
  } else if (initialSortId) {
    sortByState = [{ id: initialSortId, desc: true }];
  } else {
    sortByState = [];
  }
  let rightScrollInterval;
  let leftScrollInterval;

  const {
    getTableProps,
    rows,
    prepareRow,
    headerGroups,
    state: {
      selectedRowIds,
      sortBy,
      pageIndex,
      hiddenColumns
    },
    selectedFlatRows,
    toggleAllRowsSelected,
    page,
    canPreviousPage,
    canNextPage,
    pageCount,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    setHiddenColumns
  } = useTable(
    {
      data,
      columns: tableColumns,
      defaultColumn,
      getRowId: (row, relativeIndex) => (typeof rowId === 'function' ? rowId(row) : row[rowId] || relativeIndex),
      autoResetSelectedRows: false,
      autoResetSortBy: false,
      manualSortBy: shouldManualSort,
      // if we want to use the pagination hook, then pagination should not be manual
      manualPagination: !shouldUsePagination,
      initialState: {
        hiddenColumns: initialHiddenColumns,
        sortBy: sortByState,
      },
    },
    useFlexLayout, // this allows table to have dynamic layouts outside of standard table markup
    useResizeColumns, // this allows for resizing columns
    useSortBy, // this allows for sorting
    useExpanded, // this allows for expandable rows
    usePagination,
    useRowSelect, // this allows for checkbox in table
    (hooks) => {
      if (canSelect) {
        hooks.visibleColumns.push((columns) => [
          {
            id: 'selection',
            disableResizing: true,
            width: 50,
            Header: ({ getToggleAllRowsSelectedProps }) => ( // eslint-disable-line react/prop-types
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            ),
            Cell: ({ row }) => ( // eslint-disable-line react/prop-types
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} /> // eslint-disable-line react/prop-types
            ),
          },
          ...columns
        ]);
      }
    }
  );
  const dispatch = useDispatch();
  const tableRows = page || rows;
  // We only include filters if not wrapped in list component and hideFilter is false
  const wrappedInList = typeof getToggleColumnOptions === 'function';
  const includeFilters = !wrappedInList && !hideFilters;

  const tableRef = createRef();
  const scrollLeftButton = createRef();
  const scrollRightButton = createRef();

  useEffect(() => {
    if (canSelect && clearSelected) {
      toggleAllRowsSelected(false);
    }
  }, [canSelect, clearSelected, toggleAllRowsSelected]);

  useEffect(() => {
    const selectedIds = Object.keys(selectedRowIds).reduce((ids, key) => {
      if (selectedRowIds[key]) {
        ids.push(key);
      }
      return ids;
    }, []);

    const currentSelectedRows = selectedFlatRows.map((row) => omit(row.original, ['files']));

    if (typeof onSelect === 'function') {
      onSelect(selectedIds, currentSelectedRows);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(selectedRowIds), onSelect, JSON.stringify(selectedFlatRows.map((row) => row.id))]);

  useEffect(() => {
    if (tableId) {
      dispatch(sortPersist(tableId, sortBy));
    }
  }, [dispatch, tableId, sortBy]);

  useEffect(() => {
    if (typeof changeSortProps === 'function') {
      changeSortProps(sortBy);
    }
  }, [changeSortProps, sortBy]);

  useEffect(() => {
    if (wrappedInList) {
      getToggleColumnOptions({
        setHiddenColumns,
        hiddenColumns
      });
    }
  }, [getToggleColumnOptions, hiddenColumns, setHiddenColumns, wrappedInList]);

  function resetHiddenColumns() {
    setHiddenColumns(initialHiddenColumns);
  }

  function handleDoubleClick(id, header, originalWidth) {
    setFitColumn({
      ...fitColumn,
      [id]: getColumnWidth(tableRows, id, header, originalWidth)
    });
  }

  function handleMouseDown(e, id, onMouseDown) {
    if (fitColumn[id]) {
      const newFitColumn = omit(fitColumn, [id]);
      setFitColumn(newFitColumn);
    }
    onMouseDown(e);
  }

  function handleTableColumnMouseEnter(event) {
    if ((event.target?.className.includes('th') || event.target?.className.includes('td')) && !checkInView(tableRef.current, event.target.nextSibling, false)) {
      showScrollRightButton(event);
    }

    if ((event.target?.className.includes('th') || event.target?.className.includes('td')) && !checkInView(tableRef.current, event.target.previousSibling, false)) {
      showScrollLeftButton(event);
    }
  }

  function handleTableColumnMouseLeave(event) {
    if ((event.target?.className.includes('th') || event.target?.className.includes('td')) && !checkInView(tableRef.current, event.target.nextSibling, false)) {
      hideScrollRightButton();
    }

    if ((event.target?.className.includes('th') || event.target?.className.includes('td')) && !checkInView(tableRef.current, event.target.previousSibling, false)) {
      hideScrollLeftButton();
    }
  }

  function scrollTableRight() {
    if (tableRef !== null && tableRef.current !== null) {
      tableRef.current.scrollLeft += 20;
    }
  }

  function startScrollTableRight() {
    rightScrollInterval = setInterval(scrollTableRight, 1);
  }

  function stopScrollTableRight() {
    clearInterval(rightScrollInterval);
  }

  function scrollTableLeft() {
    if (tableRef !== null && tableRef.current !== null) {
      tableRef.current.scrollLeft -= 20;
    }
  }

  function startScrollTableLeft() {
    leftScrollInterval = setInterval(scrollTableLeft, 1);
  }

  function stopScrollTableLeft() {
    clearInterval(leftScrollInterval);
  }

  function handleLeftScrollButtonOnMouseLeave() {
    hideScrollLeftButton();
    clearInterval(leftScrollInterval);
  }

  function handleRightScrollButtonOnMouseLeave() {
    hideScrollRightButton();
    clearInterval(rightScrollInterval);
  }

  function showScrollLeftButton(event) {
    setLeftScrollButtonVisibility({ display: 'flex', opacity: leftScrollButtonVisibility.opacity });
    setTimeout(() => {
      setLeftScrollButtonVisibility({ display: 'flex', opacity: 1 });
    }, 10);
  }

  function hideScrollLeftButton() {
    if (leftScrollButtonVisibility.opacity === 1) {
      setLeftScrollButtonVisibility({ display: leftScrollButtonVisibility.display, opacity: 0 });
      setLeftScrollButtonVisibility({ display: 'none', opacity: 0 });
    }
  }

  function showScrollRightButton(event) {
    setRightScrollButtonVisibility({ display: 'flex', opacity: rightScrollButtonVisibility.opacity });
    setTimeout(() => {
      setRightScrollButtonVisibility({ display: 'flex', opacity: 1 });
    }, 10);
  }

  function hideScrollRightButton() {
    if (rightScrollButtonVisibility.opacity === 1) {
      setRightScrollButtonVisibility({ display: rightScrollButtonVisibility.display, opacity: 0 });
      setRightScrollButtonVisibility({ display: 'none', opacity: 0 });
    }
  }

  function checkInView(container, element, partial) {
    if (!container || !element) {
      return true;
    }

    // Get container properties
    const cLeft = container.scrollLeft;
    const cRight = cLeft + container.clientWidth;

    // Get element properties
    const eLeft = element.offsetLeft - container.offsetLeft;
    const eRight = eLeft + element.clientWidth;

    // Check if in view
    const isTotal = (eLeft >= cLeft && eRight <= cRight);
    const isPartial = partial && (
      (eLeft < cLeft && eRight > cLeft) ||
      (eRight > cRight && eLeft < cRight)
    );

    // Return outcome
    return (isTotal || isPartial);
  }

  return (
    <div className='table--wrapper'>
      {(includeFilters || legend) &&
        <ListFilters>
          {includeFilters &&
            <TableFilters
              columns={tableColumns}
              setHiddenColumns={setHiddenColumns}
              hiddenColumns={hiddenColumns}
              resetHiddenColumns={resetHiddenColumns}
              initialHiddenColumns={initialHiddenColumns} />
          }
          {legend}
        </ListFilters>}
      {shouldUsePagination &&
        <TableHeader
          count={data.length}
          simplePaginationOptions={{
            canPreviousPage,
            canNextPage,
            pageCount,
            gotoPage,
            nextPage,
            previousPage,
            pageOptions,
            pageIndex,
            dataCount: data.length
          }}
        />
      }
      <div className={`table ${className}`} {...getTableProps()} ref={tableRef}>
        <div className='thead'>
          <div className='tr'>
            {headerGroups.map((headerGroup) => (
              <div {...headerGroup.getHeaderGroupProps()} className="tr">
                {headerGroup.headers.map((column) => {
                  let columnClassName = '';
                  if (column.canSort) {
                    let columnClassNameSuffix;

                    if (column.isSortedDesc === true) {
                      columnClassNameSuffix = '--desc';
                    } else if (column.isSortedDesc === false) {
                      columnClassNameSuffix = '--asc';
                    } else {
                      columnClassNameSuffix = '';
                    }

                    columnClassName = `table__sort${columnClassNameSuffix}`;
                  }

                  const wrapperClassNames = classNames(
                    'th',
                    {
                      'no-resize': !column.canResize,
                    }
                  );

                  const { style, ...restHeaderProps } = column.getHeaderProps();
                  const columnWidth = fitColumn[column.id];
                  if (columnWidth) style.width = `${columnWidth}px`;

                  const {
                    onMouseDown,
                    role,
                    ...restResizerProps
                  } = column.getResizerProps ? column.getResizerProps() : {};

                  return (
                    <div {...restHeaderProps}
                      className={wrapperClassNames}
                      style={style}
                      onMouseEnter={(e) => handleTableColumnMouseEnter(e)}
                      onMouseLeave={(e) => handleTableColumnMouseLeave(e)}
                    >
                      <span {...column.getSortByToggleProps()} className={columnClassName}>
                        {column.render('Header')}
                      </span>
                      {column.canResize && <div
                        {...restResizerProps}
                        role={role}
                        title='Double click to expand'
                        onMouseDown={(e) => handleMouseDown(e, column.id, onMouseDown)}
                        onDoubleClick={() => handleDoubleClick(column.id, column.Header, column.originalWidth)}
                        className={`resizer ${column.isResizing ? 'isResizing' : ''}`}
                      />}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <div className='tbody'>
          {tableRows.map((row, i) => {
            prepareRow(row);
            return (
              <React.Fragment key={i}>
                <div className='tr' data-value={row.id} {...row.getRowProps()}>
                  {row.cells.map((cell, cellIndex) => {
                    const primaryIdx = canSelect ? 1 : 0;
                    const wrapperClassNames = classNames(
                      'td',
                      {
                        'table__main-asset': cellIndex === primaryIdx,
                        table__checkbox: canSelect && cellIndex === 0,
                      }
                    );

                    const { style, ...restCellProps } = cell.getCellProps();
                    const columnWidth = fitColumn[cell.column.id];
                    if (columnWidth) style.width = `${columnWidth}px`;

                    return (
                      <div
                        className={wrapperClassNames}
                        {...restCellProps}
                        style={style}
                        key={cellIndex}
                        onMouseEnter={(e) => handleTableColumnMouseEnter(e)}
                        onMouseLeave={(e) => handleTableColumnMouseLeave(e)}
                      >
                        {cell.render('Cell')}
                      </div>
                    );
                  })}
                </div>

                {renderRowSubComponent &&
                  <>{renderRowSubComponent(row)}</>
                }

              </React.Fragment>
            );
          })}
        </div>
      </div>
      <div role="button"
        ref={scrollLeftButton}
        tabIndex={0}
        className="scrollButton scrollButtonLeft"
        style={{
          opacity: leftScrollButtonVisibility.opacity,
          display: leftScrollButtonVisibility.display
        }}
        onMouseDown={() => startScrollTableLeft()}
        onMouseUp={() => stopScrollTableLeft()}
        onMouseEnter={() => showScrollLeftButton()}
        onMouseLeave={() => handleLeftScrollButtonOnMouseLeave()}>
        <div><i className="fa fa-arrow-circle-left fa-2x"></i></div>
        <div>SCROLL</div>
      </div>
      <div role="button"
        ref={scrollRightButton}
        tabIndex={0}
        className="scrollButton scrollButtonRight"
        style={{
          opacity: rightScrollButtonVisibility.opacity,
          display: rightScrollButtonVisibility.display
        }}
        onMouseDown={() => startScrollTableRight()}
        onMouseUp={() => stopScrollTableRight()}
        onMouseEnter={() => showScrollRightButton()}
        onMouseLeave={() => handleRightScrollButtonOnMouseLeave()}>
        <div><i className="fa fa-arrow-circle-right fa-2x"></i></div>
        <div>SCROLL</div>
      </div>
      {shouldUsePagination &&
        <SimplePagination
          canPreviousPage={canPreviousPage}
          canNextPage={canNextPage}
          pageCount={pageCount}
          gotoPage={gotoPage}
          nextPage={nextPage}
          previousPage={previousPage}
          pageOptions={pageOptions}
          pageIndex={pageIndex}
          dataCount={data.length}
        />}
    </div>
  );
};

SortableTable.propTypes = {
  canSelect: PropTypes.bool,
  changeSortProps: PropTypes.func,
  className: PropTypes.string,
  clearSelected: PropTypes.bool,
  data: PropTypes.array,
  getToggleColumnOptions: PropTypes.func,
  hideFilters: PropTypes.bool,
  initialHiddenColumns: PropTypes.array,
  initialSortId: PropTypes.string,
  legend: PropTypes.node,
  onSelect: PropTypes.func,
  rowId: PropTypes.any,
  shouldManualSort: PropTypes.bool,
  shouldUsePagination: PropTypes.bool,
  tableColumns: PropTypes.array,
  renderRowSubComponent: PropTypes.func,
  tableId: PropTypes.string,
  initialSortBy: PropTypes.array,
};

export default SortableTable;
