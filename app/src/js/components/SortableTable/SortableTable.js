import React, {
  useMemo,
  useEffect,
  forwardRef,
  useRef,
  useState
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import omit from 'lodash/omit';
import { useTable, useResizeColumns, useFlexLayout, useSortBy, useRowSelect, usePagination } from 'react-table';
import SimplePagination from '../Pagination/simple-pagination';
import TableFilters from '../Table/TableFilters';
import ListFilters from '../ListActions/ListFilters';

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
 * @description Component for rendering the header and column checkboxs when canSelect is true
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
  children,
  clearSelected,
  data = [],
  initialHiddenColumns = [],
  initialSortId,
  legend,
  onSelect,
  rowId,
  shouldManualSort = false,
  shouldUsePagination = false,
  tableColumns = [],
}) => {
  const defaultColumn = useMemo(
    () => ({
      Cell: ({ value = '' }) => value,
      // When using the useFlexLayout:
      minWidth: 30, // minWidth is only used as a limit for resizing
      width: 125, // width is used for both the flex-basis and flex-grow
    }),
    []
  );
  const [fitColumn, setFitColumn] = useState({});

  const {
    getTableProps,
    rows,
    prepareRow,
    headerGroups,
    state: {
      selectedRowIds,
      sortBy,
      pageIndex,
      hiddenColumns,
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
      getRowId: (row, relativeIndex) => (typeof rowId === 'function' ? rowId(row) : row[rowId] || relativeIndex),
      autoResetSelectedRows: false,
      autoResetSortBy: false,
      manualSortBy: shouldManualSort,
      // if we want to use the pagination hook, then pagination should not be manual
      manualPagination: !shouldUsePagination,
      initialState: {
        hiddenColumns: initialHiddenColumns,
        sortBy: initialSortId ? [{ id: initialSortId, desc: true }] : [],
      },
    },
    useFlexLayout, // this allows table to have dynamic layouts outside of standard table markup
    useResizeColumns, // this allows for resizing columns
    useSortBy, // this allows for sorting
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

  const tableRows = page || rows;
  const includeFilters = initialHiddenColumns.length > 0;

  useEffect(() => {
    if (clearSelected) {
      toggleAllRowsSelected(false);
    }
  }, [clearSelected, toggleAllRowsSelected]);

  useEffect(() => {
    const selected = Object.keys(selectedRowIds).reduce((selectedRows, key) => {
      if (selectedRowIds[key]) {
        selectedRows.push(key);
      }
      return selectedRows;
    }, []);

    if (typeof onSelect === 'function') {
      onSelect(selected);
    }
  }, [selectedRowIds, onSelect]);

  useEffect(() => {
    if (typeof changeSortProps === 'function') {
      changeSortProps(sortBy);
    }
  }, [changeSortProps, sortBy]);

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

  return (
    <div className='table--wrapper'>
      {(includeFilters || legend) &&
        <ListFilters className="list__filters--flex">
          {includeFilters &&
            <TableFilters columns={tableColumns} onChange={toggleHideColumn} hiddenColumns={hiddenColumns} />
          }
          {legend}
        </ListFilters>
      }
      <div className='table' {...getTableProps()}>
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
                    <div {...restHeaderProps} className={wrapperClassNames} style={style}>
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
              <div className='tr' data-value={row.id} {...row.getRowProps()} key={i}>
                {row.cells.map((cell, cellIndex) => {
                  const primaryIdx = canSelect ? 1 : 0;
                  const wrapperClassNames = classNames(
                    'td',
                    {
                      'table__main-asset': cellIndex === primaryIdx,
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
                    >
                      {cell.render('Cell')}
                    </div>
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
          dataCount={data.length}
        />}
    </div>
  );
};

SortableTable.propTypes = {
  canSelect: PropTypes.bool,
  changeSortProps: PropTypes.func,
  children: PropTypes.node,
  clearSelected: PropTypes.bool,
  data: PropTypes.array,
  initialHiddenColumns: PropTypes.array,
  initialSortId: PropTypes.string,
  legend: PropTypes.node,
  onSelect: PropTypes.func,
  rowId: PropTypes.any,
  shouldManualSort: PropTypes.bool,
  shouldUsePagination: PropTypes.bool,
  tableColumns: PropTypes.array,
};

export default SortableTable;
