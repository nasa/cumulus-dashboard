'use strict';
import Collapse from 'react-collapsible';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { get } from 'object-path';
import { isUndefined } from '../../utils/validate';
import { nullValue } from '../../utils/format';
import isEmpty from 'lodash.isempty';
import isFunction from 'lodash.isfunction';

const defaultSortOrder = 'desc';
const otherOrder = {
  desc: 'asc',
  asc: 'desc'
};

const Table = ({
  primaryIdx = 0,
  sortIdx,
  order,
  props,
  header,
  row,
  rowId,
  data,
  canSelect,
  collapsible,
  changeSortProps,
  onSelect
}) => {
  const [dumbState, setDumbState] = useState({
    dumbOrder: null,
    dumbSortIdx: null
  });
  const [selected, setSelected] = useState([]);
  const isTableDumb = isUndefined(sortIdx) || !order || !Array.isArray(props);
  const allChecked = !isEmpty(data) && selected.length === data.length;

  if (isTableDumb) {
    props = [];
    sortIdx = dumbState.dumbSortIdx;
    order = dumbState.dumbOrder;
    const sortName = props[sortIdx];
    const primaryName = props[primaryIdx];
    data = data.sort((a, b) =>
      // If the sort field is the same, tie-break using the primary ID field
      a[sortName] === b[sortName] ? a[primaryName] > b[primaryName]
        : (order === 'asc') ? a[sortName] < b[sortName] : a[sortName] > b[sortName]
    );
  }

  function changeSort (e) {
    if (isTableDumb) {
      sortIdx = dumbState.dumbSortIdx;
      order = dumbState.dumbOrder;
    }

    const headerName = e.currentTarget.getAttribute('data-value');
    const newSortIdx = header.indexOf(headerName);
    if (!props[newSortIdx]) { return; }
    const newOrder = sortIdx === newSortIdx ? otherOrder[order] : defaultSortOrder;

    if (typeof changeSortProps === 'function') {
      changeSortProps({ sortIdx: newSortIdx, order: newOrder });
    }
    if (isTableDumb) {
      setDumbState({ dumbSortIdx: newSortIdx, dumbOrder: newOrder });
    }
  }

  function select (e) {
    const id = (e.currentTarget.getAttribute('data-value'));
    const selectedRows = selected.includes(id)
      ? selected.filter(anId => anId !== id)
      : [...selected, id];
    setSelected(selectedRows);
    if (typeof onSelect === 'function') {
      onSelect(selectedRows);
    }
  }

  function selectAll (e) {
    if (!isEmpty(data)) {
      const rowIdFn = isFunction(rowId) ? rowId : row => row[rowId];
      const allSelected = selected.length === data.length;
      const selectedRows = allSelected ? [] : data.map(rowIdFn);
      setSelected(selectedRows);
    }
  }

  return (
    <div className='table--wrapper'>
      <form>
        <table>
          <thead>
            <tr>
              {canSelect &&
                <td>
                  <input
                    type='checkbox'
                    className='form-select__all'
                    name='Select'
                    checked={allChecked}
                    onChange={selectAll}
                  />
                </td>
              }
              {header.map((h, i) => {
                let className = (isTableDumb || props[i]) ? 'table__sort' : '';
                if (i === sortIdx) { className += (' table__sort--' + order); }
                return (
                  <td
                    className={className}
                    key={h}
                    data-value={h}
                    onClick={changeSort}>{h}
                  </td>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => {
              const dataId = typeof rowId === 'function' ? rowId(d) : d[rowId];
              const checked = canSelect && selected.indexOf(dataId) !== -1;
              return (
                <tr key={i} data-value={dataId} onClick={select}>
                  {canSelect &&
                    <td>
                      <input type={'checkbox'} checked={checked} readOnly/>
                    </td>
                  }
                  {row.map((accessor, k) => {
                    let className = k === primaryIdx ? 'table__main-asset' : '';
                    let text;

                    if (typeof accessor === 'function') {
                      text = accessor(d, k, data);
                    } else {
                      text = get(d, accessor, nullValue);
                    }
                    return <td key={String(i) + String(k) + text} className={className}>{text}</td>;
                  })}
                  {collapsible &&
                    <td>
                      <Collapse trigger={'More Details'} triggerWhenOpen={'Less Details'}>
                        <pre className={'pre-style'}>{JSON.stringify(d.eventDetails, null, 2)}</pre>
                      </Collapse>
                    </td>
                  }
                </tr>
              );
            })}
          </tbody>
        </table>
      </form>
    </div>
  );
};

Table.propTypes = {
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
  rowId: PropTypes.any
};

export default Table;
