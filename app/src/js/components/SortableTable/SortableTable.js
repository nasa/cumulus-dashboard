'use strict';
import React, {
  useMemo,
  useEffect,
  forwardRef,
  useRef
} from 'react';
import PropTypes from 'prop-types';
import { useTable, useResizeColumns, useFlexLayout, useSortBy, useRowSelect, usePagination } from 'react-table';
import SimplePagination from '../Pagination/simple-pagniation';
import TableFilters from '../Table/TableFilters';

/**
 * IndeterminateCheckbox
 * @description Component for rendering the header and column checkboxs when canSelect is true
 * Taken from react-table examples
 */
const IndeterminateCheckbox = forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = useRef();
    const resolvedRef = ref || defaultRef;

    useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <input type="checkbox" ref={resolvedRef} {...rest} />
    );
  }
);

IndeterminateCheckbox.propTypes = {
  indeterminate: PropTypes.any,
  onChange: PropTypes.func
};

const SortableTable = ({
  sortId,
  initialSortId,
  rowId,
  order = 'desc',
  canSelect,
  changeSortProps,
  tableColumns = [],
  data = [],
  onSelect,
  clearSelected,
  shouldUsePagination = false,
  initialHiddenColumns = []
}) => {
  const defaultColumn = useMemo(
    () => ({
      // When using the useFlexLayout:
      minWidth: 30, // minWidth is only used as a limit for resizing
      width: 125, // width is used for both the flex-basis and flex-grow
      maxWidth: 350, // maxWidth is only used as a limit for resizing
    }),
    []
  );

  const shouldManualSort = !!initialSortId;

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
    toggleAllRowsSelected,
    page,
    canPreviousPage,
    canNextPage,
    pageCount,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    toggleHideColumn
  } = useTable(
    {
      data,
      columns: tableColumns,
      defaultColumn,
      getRowId: (row, relativeIndex) => typeof rowId === 'function' ? rowId(row) : row[rowId] || relativeIndex,
      autoResetSelectedRows: false,
      autoResetSortBy: false,
      manualSortBy: shouldManualSort,
      manualPagination: !shouldUsePagination, // if we want to use the pagination hook, then pagination should not be manual
      initialState: {
        hiddenColumns: initialHiddenColumns
      }
    },
    useFlexLayout, // this allows table to have dynamic layouts outside of standard table markup
    useResizeColumns, // this allows for resizing columns
    useSortBy, // this allows for sorting
    useRowSelect, // this allows for checkbox in table
    usePagination,
    hooks => {
      if (canSelect) {
        hooks.visibleColumns.push(columns => [
          {
            id: 'selection',
            Header: ({ getToggleAllRowsSelectedProps }) => ( // eslint-disable-line react/prop-types
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            ),
            Cell: ({ row }) => ( // eslint-disable-line react/prop-types
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} /> // eslint-disable-line react/prop-types
            ),
            minWidth: 61,
            width: 61,
            maxWidth: 61
          },
          ...columns
        ]);
      }
    }
  );

  const tableRows = page || rows;
  const includeFilters = initialHiddenColumns.length > 0;

  useEffect(() => {
    if (clearSelected) {
      toggleAllRowsSelected(false);
    }
  }, [clearSelected, toggleAllRowsSelected]);

  useEffect(() => {
    const selected = [];

    for (const [key, value] of Object.entries(selectedRowIds)) {
      if (value) {
        selected.push(key);
      }
    }
    if (typeof onSelect === 'function') {
      onSelect(selected);
    }
  }, [selectedRowIds, onSelect]);

  useEffect(() => {
    const [sortProps = {}] = sortBy;
    const { id, desc } = sortProps;
    let sortOrder;
    if (typeof desc !== 'undefined') {
      sortOrder = desc ? 'desc' : 'asc';
    }
    const sortFieldId = id || sortId;
    if (typeof changeSortProps === 'function') {
      changeSortProps({ sortId: sortFieldId, order: sortOrder || order });
    }
  }, [changeSortProps, sortBy, sortId, order]);

  return (
    <div className='table--wrapper'>
      {includeFilters &&
        <TableFilters columns={tableColumns} onChange={toggleHideColumn} hiddenColumns={hiddenColumns} />
      }
      <form>
        <div className='table' {...getTableProps()}>
          <div className='thead'>
            <div className='tr'>
              {headerGroups.map(headerGroup => (
                <div {...headerGroup.getHeaderGroupProps()} className="tr">
                  {headerGroup.headers.map(column => {
                    let columnClassName = '';
                    if (column.canSort) {
                      columnClassName = `table__sort${column.isSortedDesc === true ? '--desc' : (column.isSortedDesc === false ? '--asc' : '')}`;
                    }
                    return (
                      <div {...column.getHeaderProps()} className='th'>
                        <div {...column.getSortByToggleProps()} className={columnClassName}>
                          {column.render('Header')}
                        </div>
                        <div
                          {...column.getResizerProps()}
                          className={`resizer ${column.isResizing ? 'isResizing' : ''}`}
                        />
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
                <div className='tr' data-value={row.id} {...row.getRowProps()} key={i}>
                  {row.cells.map((cell, cellIndex) => {
                    const primaryIdx = canSelect ? 1 : 0;
                    return (
                      <React.Fragment key={cellIndex}>
                        <div
                          className={`td ${cellIndex === primaryIdx ? 'table__main-asset' : ''}`}
                          {...cell.getCellProps()}
                          key={cellIndex}
                        >
                          {cell.render('Cell')}
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              );
            })}
          </div>
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
          />}
      </form>
    </div>
  );
};

SortableTable.propTypes = {
  data: PropTypes.array,
  order: PropTypes.string,
  sortId: PropTypes.string,
  initialSortId: PropTypes.string,
  changeSortProps: PropTypes.func,
  onSelect: PropTypes.func,
  canSelect: PropTypes.bool,
  rowId: PropTypes.any,
  tableColumns: PropTypes.array,
  clearSelected: PropTypes.bool,
  shouldUsePagination: PropTypes.bool,
  initialHiddenColumns: PropTypes.array
};

export default SortableTable;
