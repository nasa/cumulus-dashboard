'use strict';
import React, {
  useMemo,
  useEffect,
  forwardRef,
  useRef
} from 'react';
import PropTypes from 'prop-types';
import { useTable, useResizeColumns, useFlexLayout, useSortBy, useRowSelect } from 'react-table';

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
  sortIdx,
  rowId,
  order = 'desc',
  canSelect,
  changeSortProps,
  tableColumns = [],
  data = [],
  onSelect
}) => {
  const defaultColumn = useMemo(
    () => ({
      // When using the useFlexLayout:
      minWidth: 30, // minWidth is only used as a limit for resizing
      width: 125, // width is used for both the flex-basis and flex-grow
      maxWidth: 300, // maxWidth is only used as a limit for resizing
    }),
    []
  );

  const shouldManualSort = !!sortIdx;

  const {
    getTableProps,
    rows,
    prepareRow,
    headerGroups,
    state: {
      selectedRowIds,
      sortBy
    },
  } = useTable(
    {
      data,
      columns: tableColumns,
      defaultColumn,
      getRowId: (row, relativeIndex) => typeof rowId === 'function' ? rowId(row) : row[rowId] || relativeIndex,
      autoResetSelectedRows: false,
      autoResetSortBy: false,
      manualSortBy: shouldManualSort
    },
    useFlexLayout, // this allows table to have dynamic layouts outside of standard table markup
    useResizeColumns, // this allows for resizing columns
    useSortBy, // this allows for sorting
    useRowSelect, // this allows for checkbox in table
    hooks => {
      if (canSelect) {
        hooks.visibleColumns.push(columns => [
          {
            id: 'selection',
            Header: ({ getToggleAllRowsSelectedProps }) => ( // eslint-disable-line react/prop-types
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            ),
            Cell: ({ row }) => (
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
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

  useEffect(() => {
    let selected = [];

    for (let [key, value] of Object.entries(selectedRowIds)) {
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
    const sortFieldId = id || sortIdx;
    if (typeof changeSortProps === 'function') {
      changeSortProps({ sortIdx: sortFieldId, order: sortOrder || order });
    }
  }, [changeSortProps, sortBy, sortIdx, order]);

  return (
    <div className='table--wrapper'>
      <form>
        <div className='table' {...getTableProps()}>
          <div className='thead'>
            <div className='tr'>
              {headerGroups.map(headerGroup => (
                <div {...headerGroup.getHeaderGroupProps()} className="tr">
                  {headerGroup.headers.map(column => {
                    return (
                      <div {...column.getHeaderProps()} className='th'>
                        <div {...column.getSortByToggleProps()} className={`${column.canSort ? 'table__sort' : ''}`}>
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
            {rows.map((row, i) => {
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
      </form>
    </div>
  );
};

SortableTable.propTypes = {
  primaryIdx: PropTypes.number,
  data: PropTypes.array,
  header: PropTypes.array,
  order: PropTypes.string,
  row: PropTypes.array,
  sortIdx: PropTypes.string,
  changeSortProps: PropTypes.func,
  onSelect: PropTypes.func,
  canSelect: PropTypes.bool,
  collapsible: PropTypes.bool,
  rowId: PropTypes.any,
  tableColumns: PropTypes.array
};

export default SortableTable;
