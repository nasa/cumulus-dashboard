'use strict';
// import Collapse from 'react-collapsible';
import React, {
  useMemo,
  useEffect,
  forwardRef,
  useRef
} from 'react';
import PropTypes from 'prop-types';
// import { get } from 'object-path';
// import { isUndefined } from '../../utils/validate';
// import { nullValue } from '../../utils/format';
import { useTable, useResizeColumns, useFlexLayout, useSortBy, useRowSelect } from 'react-table';

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
  primaryIdx = 0,
  sortIdx,
  order = 'desc',
  // props,
  rowId,
  canSelect,
  // collapsible,
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
            minWidth: 30,
            width: 30,
            maxWidth: 30
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
    const order = desc ? 'desc' : 'asc';
    if (typeof changeSortProps === 'function') {
      changeSortProps({ sortIdx: id, order });
    }
  }, [changeSortProps, sortBy]);

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
                      <div {...column.getHeaderProps(column.getSortByToggleProps())} className={`th ${column.canSort ? 'table__sort' : ''}`}>
                        {column.render('Header')}
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
                <div className='tr' {...row.getRowProps()} key={i}>
                  {row.cells.map((cell, cellIndex) => {
                    return (
                      <div
                        className={`td ${cell.column.id === row.id ? 'table__main-asset' : ''}`}
                        {...cell.getCellProps()}
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
      </form>
    </div>
  );
};

SortableTable.propTypes = {
  primaryIdx: PropTypes.number,
  data: PropTypes.array,
  header: PropTypes.array,
  props: PropTypes.array,
  row: PropTypes.array,
  sortIdx: PropTypes.number,
  order: PropTypes.string,
  changeSortProps: PropTypes.func,
  onSelect: PropTypes.func,
  canSelect: PropTypes.bool,
  collapsible: PropTypes.bool,
  selectedRows: PropTypes.array,
  rowId: PropTypes.any,
  tableColumns: PropTypes.array
};

export default SortableTable;
